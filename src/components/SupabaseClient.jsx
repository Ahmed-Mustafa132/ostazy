// Supabase Client - Final Version
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeheader.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeheader';


console.log('✅ Supabase client initialized successfully');

const getHeaders = (token = null) => {
  const headers = {
    'apikey': supabaseKey,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    'x-application-name': 'ostazy'
  };

  if (!token) {
    const sessionStr = localStorage.getItem('sb-auth-token') || localStorage.getItem('sb-session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        token = session?.access_token;
      } catch (e) { /* ignore */ }
    }
  }

  // إضافة Authorization دائماً: إما token المستخدم أو anon key
  headers['Authorization'] = `Bearer ${token || supabaseKey}`;

  return headers;
};

// Query Builder Class
class SupabaseQueryBuilder {
  constructor(table) {
    this.table = table;
    this.queryParams = [];
    this.method = 'GET';
    this.bodyData = null;
    this.headers = getHeaders();
    this.singleResult = false;
  }

  select(columns = '*', options = {}) {
    this.queryParams.push(`select=${columns}`);
    if (options.count) this.queryParams.push('count=exact');
    return this;
  }

  eq(column, value) {
    this.queryParams.push(`${column}=eq.${value}`);
    return this;
  }

  in(column, values) {
    const valueString = Array.isArray(values) ? values.map(v => `"${v}"`).join(',') : values;
    this.queryParams.push(`${column}=in.(${valueString})`);
    return this;
  }

  order(column, options = {}) {
    const ascending = options.ascending !== false;
    this.queryParams.push(`order=${column}.${ascending ? 'asc' : 'desc'}`);
    return this;
  }

  limit(count) {
    this.queryParams.push(`limit=${count}`);
    return this;
  }

  single() {
    this.singleResult = true;
    this.headers['Accept'] = 'application/vnd.pgrst.object+json';
    this.queryParams.push('limit=1');
    return this;
  }

  maybeSingle() {
    this.singleResult = true;
    this.headers['Accept'] = 'application/vnd.pgrst.object+json';
    this.queryParams.push('limit=1');
    return this;
  }

  async execute() {
    const queryString = this.queryParams.join('&');
    const url = `${supabaseUrl}/rest/v1/${this.table}${queryString ? '?' + queryString : ''}`;

    try {
      const response = await fetch(url, {
        method: this.method,
        headers: this.headers,
        body: this.bodyData ? JSON.stringify(this.bodyData) : undefined
      });

      if (this.method === 'DELETE' && response.status === 204) {
        return { data: null, error: null };
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 406 || data.code === 'PGRST116') {
          return { data: null, error: response.status === 406 ? { code: 'PGRST116', message: 'Row not found' } : data };
        }
        return { data: null, error: data };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }
}

export const supabase = {
  auth: {
    signUp: async ({ email, password, options }) => {
      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ email, password, data: options?.data }),
        });
        const data = await response.json();
        if (!response.ok) throw data;
        return { data, error: null };
      } catch (error) {
        console.error('❌ Sign up error:', error);
        return { data: null, error };
      }
    },

    signInWithPassword: async ({ email, password }) => {
      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw data;

        localStorage.setItem('sb-auth-token', JSON.stringify(data));
        console.log('✅ User signed in successfully');

        return { data: { session: data, user: data.user }, error: null };
      } catch (error) {
        console.error('❌ Sign in error:', error);
        return { data: null, error };
      }
    },

    signInWithOAuth: async ({ provider, options = {} }) => {
      try {
        const redirectTo = options.redirectTo || window.location.origin;
        const params = new URLSearchParams({
          provider: provider,
          redirect_to: redirectTo,
        });

        if (options.queryParams) {
          Object.entries(options.queryParams).forEach(([key, value]) => {
            params.append(key, value);
          });
        }

        if (options.scopes) {
          params.append('scopes', options.scopes);
        }

        const oauthUrl = `${supabaseUrl}/auth/v1/authorize?${params.toString()}`;
        console.log('✅ Redirecting to OAuth provider:', provider);

        if (options.skipBrowserRedirect) {
          return { data: { url: oauthUrl, provider }, error: null };
        }

        window.location.href = oauthUrl;
        return { data: { url: oauthUrl, provider }, error: null };
      } catch (error) {
        console.error('❌ OAuth error:', error);
        return { data: null, error };
      }
    },

    signInWithGoogle: async function (options = {}) {
      return this.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: options.redirectTo || window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            ...(options.queryParams || {})
          },
          scopes: options.scopes,
          skipBrowserRedirect: options.skipBrowserRedirect
        }
      });
    },

    signInWithApple: async function (options = {}) {
      return this.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: options.redirectTo || window.location.origin,
          queryParams: {
            ...(options.queryParams || {})
          },
          scopes: options.scopes,
          skipBrowserRedirect: options.skipBrowserRedirect
        }
      });
    },

    signOut: async () => {
      const session = JSON.parse(localStorage.getItem('sb-auth-token') || 'null');
      if (session?.access_token) {
        try {
          await fetch(`${supabaseUrl}/auth/v1/logout`, {
            method: 'POST',
            headers: getHeaders(session.access_token),
          });
          console.log('✅ User signed out successfully');
        } catch (error) {
          console.error('⚠️ Sign out error:', error);
        }
      }
      localStorage.removeItem('sb-auth-token');
      localStorage.removeItem('sb-session');
      return { error: null };
    },

    getSession: () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken) {
        const oauthSession = {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: hashParams.get('token_type') || 'bearer',
          expires_in: parseInt(hashParams.get('expires_in') || '3600'),
          user: null
        };

        localStorage.setItem('sb-auth-token', JSON.stringify(oauthSession));
        window.history.replaceState({}, document.title, window.location.pathname);
        return { data: { session: oauthSession }, error: null };
      }

      const sessionStr = localStorage.getItem('sb-auth-token') || localStorage.getItem('sb-session');
      return { data: { session: sessionStr ? JSON.parse(sessionStr) : null }, error: null };
    },

    getUser: async () => {
      supabase.auth.getSession();

      const sessionStr = localStorage.getItem('sb-auth-token') || localStorage.getItem('sb-session');
      if (!sessionStr) return { data: { user: null }, error: null };

      const session = JSON.parse(sessionStr);
      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: getHeaders(session.access_token),
        });
        const user = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('sb-auth-token');
            localStorage.removeItem('sb-session');
            return { data: { user: null }, error: user };
          }
          throw user;
        }

        return { data: { user }, error: null };
      } catch (error) {
        console.error('❌ Get user error:', error);
        return { data: { user: null }, error };
      }
    },

    getCurrentUserWithProfile: async () => {
      supabase.auth.getSession();

      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;

      try {
        const sessionStr = localStorage.getItem('sb-auth-token') || localStorage.getItem('sb-session');
        if (!sessionStr) return user;

        const session = JSON.parse(sessionStr);
        const response = await fetch(`${supabaseUrl}/rest/v1/user_profiles?email=eq.${user.email}`, {
          headers: { ...getHeaders(session.access_token), 'Accept': 'application/vnd.pgrst.object+json' }
        });

        if (response.ok) {
          const profile = await response.json();
          console.log('✅ User profile loaded');
          return { ...user, ...profile };
        }

        return user;
      } catch (e) {
        console.error('⚠️ Error fetching profile:', e);
        return user;
      }
    },

    onAuthStateChange: (callback) => {
      const checkAuth = async () => {
        try {
          supabase.auth.getSession();

          const { data: { user } } = await supabase.auth.getUser();
          callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null);
        } catch (e) {
          callback('SIGNED_OUT', null);
        }
      };

      checkAuth();

      return {
        data: {
          subscription: {
            unsubscribe: () => console.log('Auth listener unsubscribed')
          }
        }
      };
    }
  },

  from: (table) => {
    const builder = new SupabaseQueryBuilder(table);

    builder.insert = async (data) => {
      builder.method = 'POST';
      builder.bodyData = Array.isArray(data) ? data : [data];
      builder.headers['Prefer'] = 'return=representation';
      const result = await builder.execute();

      if (result.error) {
        console.error(`❌ Insert error in ${table}:`, result.error);
      } else {
        console.log(`✅ Inserted into ${table}`);
      }

      return result;
    };

    builder.update = (data) => {
      builder.method = 'PATCH';
      builder.bodyData = data;
      builder.headers['Prefer'] = 'return=representation';
      return builder;
    };

    builder.delete = () => {
      builder.method = 'DELETE';
      return builder;
    };

    return builder;
  },

  rpc: async (functionName, params = {}) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (!response.ok) throw data;
      return { data, error: null };
    } catch (error) {
      console.error(`❌ RPC error (${functionName}):`, error);
      return { data: null, error };
    }
  },

  functions: {
    invoke: async (functionName, options = {}) => {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
          method: options.method || 'POST',
          headers: {
            ...getHeaders(),
            ...options.headers
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
        });

        const data = await response.json();
        if (!response.ok) throw data;

        return { data, error: null };
      } catch (error) {
        console.error(`❌ Function invoke error (${functionName}):`, error);
        return { data: null, error };
      }
    }
  },

  storage: {
    from: (bucket) => ({
      upload: async (path, file) => {
        const sessionStr = localStorage.getItem('sb-auth-token') || localStorage.getItem('sb-session');
        const session = JSON.parse(sessionStr || '{}');
        const token = session?.access_token;

        try {
          const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
            method: 'POST',
            headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${token}` },
            body: file
          });

          const data = await response.json();
          if (!response.ok) throw data;

          console.log(`✅ File uploaded to ${bucket}/${path}`);

          return {
            data: {
              path: data.Key || path,
              fullPath: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
            },
            error: null
          };
        } catch (error) {
          console.error('❌ Upload error:', error);
          return { data: null, error };
        }
      },

      getPublicUrl: (path) => ({
        data: {
          publicUrl: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
        }
      })
    })
  }
};