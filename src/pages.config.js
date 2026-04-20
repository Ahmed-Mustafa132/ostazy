import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import UserLogin from "./pages/UserLogin";
import VideoSession from "./pages/VideoSession";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherGroups from "./pages/TeacherGroups";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherDetails from "./pages/TeacherDetails";
import TeacherCoupons from "./pages/TeacherCoupons";
import TeacherCalendar from "./pages/TeacherCalendar";
import TeacherWallet from "./pages/TeacherWallet";
import RateTeacher from "./pages/RateTeacher";
import StudentDashboard from "./pages/StudentDashboard";
import StudentAssignments from "./pages/StudentAssignments";
import StudentCalendar from "./pages/StudentCalendar";
import StudentProgress from "./pages/StudentProgress";
import StudentProgressDetails from "./pages/StudentProgressDetails";
import StudentGoals from "./pages/StudentGoals";
import StudentSettings from "./pages/StudentSettings";
import AdminDashboard from "./pages/AdminDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import CenterDetails from "./pages/CenterDetails";
import CenterAdminDashboard from "./pages/CenterAdminDashboard";
import CompleteProfile from "./pages/CompleteProfile";
import EnrollGroup from "./pages/EnrollGroup";
import EducationalServices from "./pages/EducationalServices";
import GroupDetails from "./pages/GroupDetails";
import GroupContent from "./pages/GroupContent";
import GroupChat from "./pages/GroupChat";
import CreateStudyGroup from "./pages/CreateStudyGroup";
import CreateCoupon from "./pages/CreateCoupon";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiesPolicy from "./pages/CookiesPolicy";
import PaymentCheckout from "./pages/PaymentCheckout";
import MigrationExport from "./pages/MigrationExport";
import SessionTracking from "./pages/SessionTracking";
import Support from "./pages/Support";
import AdminSupport from "./pages/AdminSupport";
import DeleteAccount from "./pages/DeleteAccount";
import LayoutComponent from "./Layout.jsx";
import AccountSettings from "./pages/AccountSettings.jsx";
import AdminWalletRequests from "./pages/AdminWalletRequests.jsx";
export const PAGES = {
  home: { component: Home, protected: false },
  browse: { component: Browse, protected: false },
  login: { component: Login, protected: false },
  register: { component: Register, protected: false },
  userlogin: { component: UserLogin, protected: false },
  privacypolicy: { component: PrivacyPolicy, protected: false },
  termsandconditions: { component: TermsAndConditions, protected: false },
  cookiespolicy: { component: CookiesPolicy, protected: false },

  chat: { component: Chat, protected: true },
  messages: { component: Messages, protected: true },
  videosession: { component: VideoSession, protected: true },
  AccountSettings: { component: AccountSettings, protected: true },

  teacherdashboard: { component: TeacherDashboard, protected: true },
  teachergroups: { component: TeacherGroups, protected: true },
  teacherstudents: { component: TeacherStudents, protected: true },
  teacherdetails: { component: TeacherDetails, protected: true },
  teachercoupons: { component: TeacherCoupons, protected: true },
  teachercalendar: { component: TeacherCalendar, protected: true },
  teacherwallet: { component: TeacherWallet, protected: true },
  rateteacher: { component: RateTeacher, protected: true },

  studentdashboard: { component: StudentDashboard, protected: true },
  studentassignments: { component: StudentAssignments, protected: true },
  studentcalendar: { component: StudentCalendar, protected: true },
  studentprogress: { component: StudentProgress, protected: true },
  studentprogressdetails: {
    component: StudentProgressDetails,
    protected: true,
  },
  studentgoals: { component: StudentGoals, protected: true },
  studentsettings: { component: StudentSettings, protected: true },

  admindashboard: { component: AdminDashboard, protected: true },
  moderatordashboard: { component: ModeratorDashboard, protected: true },
  AdminWalletRequests: { component: AdminWalletRequests, protected: true },

  centerdetails: { component: CenterDetails, protected: true },
  centeradmindashboard: { component: CenterAdminDashboard, protected: true },

  completeprofile: { component: CompleteProfile, protected: true },
  enrollgroup: { component: EnrollGroup, protected: true },
  educationalservices: { component: EducationalServices, protected: true },

  groupdetails: { component: GroupDetails, protected: true },
  groupcontent: { component: GroupContent, protected: true },
  groupchat: { component: GroupChat, protected: true },
  createstudygroup: { component: CreateStudyGroup, protected: true },

  createcoupon: { component: CreateCoupon, protected: true },
  paymentcheckout: { component: PaymentCheckout, protected: true },

  migrationexport: { component: MigrationExport, protected: true },
  sessiontracking: { component: SessionTracking, protected: true },

  support: { component: Support, protected: false },
  adminsupport: { component: AdminSupport, protected: true },

  deleteaccount: { component: DeleteAccount, protected: false },
};

export const pagesConfig = {
  mainPage: "home",
  Pages: PAGES,
  Layout: LayoutComponent,
};
