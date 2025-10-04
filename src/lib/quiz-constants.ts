// Sleep Quiz Configuration
export const STOP_BANG_QUIZ_CONFIG = {
  id: "stop-bang",
  title: "پرسشنامه ارزیابی کیفیت خواب (Stop Bang)",
  description:
    "این پرسشنامه یک ابزار غربالگری ساده است که به شما کمک می‌کند تا خطر ابتلا به آپنه خواب (وقفه تنفسی در خواب) را در خود ارزیابی کنید.",
  maxScore: 8, // 8 questions * 1 max score
  goodScoreThreshold: 2,
  moderateScoreThreshold: 4,
  lowScoreThreshold: 6,
  questions: [
    {
      id: 1,
      question: "آیا هنگام خواب خروپف بلند دارید؟",
      options: [
        { text: "خیر", score: 0 },
        { text: "بله", score: 1 },
      ],
    },
    {
      id: 2,
      question: "آیا در طول روز اغلب احساس خستگی یا خواب آلودگی می کنید؟",
      options: [
        { text: "خیر", score: 0 },
        { text: "بله", score: 1 },
      ],
    },
    {
      id: 3,
      question: "آیا کسی دیده که هنگام خواب قطع تنفس داشته باشید؟",
      options: [
        { text: "خیر", score: 0 },
        { text: "بله", score: 1 },
      ],
    },
    {
      id: 4,
      question: "آیا فشار خون بالا دارید؟",
      options: [
        { text: "خیر", score: 0 },
        { text: "بله", score: 1 },
      ],
    },
    {
      id: 5,
      question: "آیا BMI شما بیش از ۳۵ است؟ (چاقی شدید)",
      options: [
        { text: "خیر", score: 0 },
        { text: "بله", score: 1 },
      ],
    },
    {
      id: 6,
      question: "آیا سن شما بیش از ۵۰ سال است؟",
      options: [
        { text: "خیر", score: 0 },
        { text: "بله", score: 1 },
      ],
    },
    {
      id: 7,
      question: "آیا دور گردن شما بیش از ۴۰ سانتی متر است؟",
      options: [
        { text: "خیر", score: 0 },
        { text: "بله", score: 1 },
      ],
    },
    {
      id: 8,
      question: "آیا شما مرد هستید؟",
      options: [
        { text: "خیر", score: 0 },
        { text: "بله", score: 1 },
      ],
    },
  ],
  scoreInterpretations: {
    lowRisk: {
      level: "ریسک پایین OSA",
      color: "bg-green-500",
      recommendation: [
        "آموزش به بیمار درباره علائم OSA",
        "تغییر سبک زندگی (کاهش وزن، ترک سیگار، کاهش الکل، ورزش)",
        "پیگیری در صورت بروز علائم جدید",
      ],
    },
    moderateRisk: {
      level: "ریسک متوسط OSA",
      color: "bg-yellow-500",
      recommendation: [
        "بررسی دقیق‌تر شرح حال و معاینه",
        "در صورت علائم قوی (خواب‌آلودگی روزانه، چاقی شدید) ،توصیه به پلی‌سومنوگرافی",
        "غربالگری بیماری‌های همراه (HTN، دیابت، سندرم متابولیک)",
      ],
    },
    highRisk: {
      level: "ریسک بالا OSA",
      color: "bg-red-500",
      recommendation: [
        "ارجاع برای پلی‌سومنوگرافی شبانه (PSG) یا تست خواب خانگی معتبر",
        "در صورت تأیید OSA، شروع درمان (CPAP یا گزینه‌های جایگزین مثل دستگاه دهانی، جراحی در موارد خاص)",
        "مدیریت بیماری‌های همراه (HTN، دیابت، بیماری قلبی)",
      ],
    },
  },
};

// Stress Quiz Configuration (Example)
export const EPWORTH_QUIZ_CONFIG = {
  id: "Epworth",
  title: "پرسشنامه خواب‌آلودگی اپورث (Epworth)",
  description:
    "این پرسشنامه به شما کمک می‌کند تا سطح خواب‌آلودگی عمومی خود را در طول روز ارزیابی کنید.",
  hint: "در هر موقعیت، شدت احتمال به خواب رفتن را مشخص کنید.",
  maxScore: 24,
  goodScoreThreshold: 7,
  moderateScoreThreshold: 9,
  lowScoreThreshold: 15,
  questions: [
    {
      id: 1,
      question: "نشستن و مطالعه",
      options: [
        { text: "هیچ‌وقت", score: 0 },
        { text: "احتمال کم", score: 1 },
        { text: "احتمال متوسط", score: 2 },
        { text: "احتمال زیاد", score: 3 },
      ],
    },
    {
      id: 2,
      question: "تماشای تلویزیون",
      options: [
        { text: "هیچ‌وقت", score: 0 },
        { text: "احتمال کم", score: 1 },
        { text: "احتمال متوسط", score: 2 },
        { text: "احتمال زیاد", score: 3 },
      ],
    },
    {
      id: 3,
      question: "نشستن در مکان عمومی (مانند سینما یا جلسه)",
      options: [
        { text: "هیچ‌وقت", score: 0 },
        { text: "احتمال کم", score: 1 },
        { text: "احتمال متوسط", score: 2 },
        { text: "احتمال زیاد", score: 3 },
      ],
    },
    {
      id: 4,
      question: "مسافرت کوتاه به‌عنوان مسافر (یک ساعت بدون توقف)",
      options: [
        { text: "هیچ‌وقت", score: 0 },
        { text: "احتمال کم", score: 1 },
        { text: "احتمال متوسط", score: 2 },
        { text: "احتمال زیاد", score: 3 },
      ],
    },
    {
      id: 5,
      question: "دراز کشیدن عصر برای استراحت",
      options: [
        { text: "هیچ‌وقت", score: 0 },
        { text: "احتمال کم", score: 1 },
        { text: "احتمال متوسط", score: 2 },
        { text: "احتمال زیاد", score: 3 },
      ],
    },
    {
      id: 6,
      question: "نشستن و صحبت با کسی",
      options: [
        { text: "هیچ‌وقت", score: 0 },
        { text: "احتمال کم", score: 1 },
        { text: "احتمال متوسط", score: 2 },
        { text: "احتمال زیاد", score: 3 },
      ],
    },
    {
      id: 7,
      question: "نشستن آرام بعد از ناهار (بدون الکل)",
      options: [
        { text: "هیچ‌وقت", score: 0 },
        { text: "احتمال کم", score: 1 },
        { text: "احتمال متوسط", score: 2 },
        { text: "احتمال زیاد", score: 3 },
      ],
    },
    {
      id: 8,
      question: "رانندگی در حال توقف چند دقیقه‌ای در ترافیک",
      options: [
        { text: "هیچ‌وقت", score: 0 },
        { text: "احتمال کم", score: 1 },
        { text: "احتمال متوسط", score: 2 },
        { text: "احتمال زیاد", score: 3 },
      ],
    },
  ],
  scoreInterpretations: {
    good: {
      level: "خواب‌آلودگی طبیعی",
      color: "bg-green-500",
      recommendation: [
        "ادامه سبک زندگی سالم (خواب منظم، تغذیه مناسب، ورزش)",
        "مدیریت استرس و رعایت بهداشت خواب (Sleep Hygiene)",
        "پیگیری دوره‌ای در صورت تغییر وضعیت خواب یا بروز علائم جدید",
      ],
    },
    moderate: {
      level: "خواب‌آلودگی خفیف",
      color: "bg-yellow-500",
      recommendation: [
        "آموزش بهداشت خواب (خواب کافی، کاهش مصرف کافئین و الکل، محدودیت صفحه‌نمایش قبل از خواب)",
        "استفاده از تکنیک‌های آرام‌سازی و مدیریت استرس",
        "بررسی داروهای مصرفی یا شرایط طبی که می‌تواند در خواب اختلال ایجاد کند",
        "پیگیری در صورت عدم بهبود یا تشدید علائم",
      ],
    },
    needsReview: {
      level: "خواب‌آلودگی متوسط (مشکوک به اختلال خواب)",
      color: "bg-orange-500",
      recommendation: [
        "ارجاع به پزشک عمومی یا متخصص خواب جهت بررسی بیشتر",
        "در نظر گرفتن انجام تست‌های تشخیصی مثل پلی‌سومنوگرافی در صورت علائم همراه",
        "غربالگری بیماری‌های همراه مانند افسردگی، اضطراب، یا مشکلات تیروئید",
        "مشاوره در زمینه بهداشت خواب و تغییر سبک زندگی",
      ],
    },
    low: {
      level:
        "خواب‌آلودگی شدید (احتمال بالا برای اختلال خواب مانند OSA یا Narcolepsy)",
      color: "bg-red-500",
      recommendation: [
        "ارجاع فوری به متخصص خواب یا روانپزشک",
        "انجام پلی‌سومنوگرافی یا سایر تست‌های خواب جهت تشخیص قطعی",
        "بررسی و درمان بیماری‌های همراه (OSA، نارکولپسی، افسردگی)",
        "شروع درمان مناسب بر اساس نتیجه تست (CPAP، دارودرمانی، مشاوره تخصصی)",
      ],
    },
  },
};

// Quiz Registry
export const QUIZ_REGISTRY = {
  "stop-bang": STOP_BANG_QUIZ_CONFIG,
  Epworth: EPWORTH_QUIZ_CONFIG,
};

// Legacy exports for backward compatibility
export const QUIZ_QUESTIONS = STOP_BANG_QUIZ_CONFIG.questions;
export const QUIZ_SCORE_INTERPRETATIONS =
  STOP_BANG_QUIZ_CONFIG.scoreInterpretations;
export const QUIZ_CONFIG = {
  maxScore: STOP_BANG_QUIZ_CONFIG.maxScore,
  goodScoreThreshold: STOP_BANG_QUIZ_CONFIG.goodScoreThreshold,
  moderateScoreThreshold: STOP_BANG_QUIZ_CONFIG.moderateScoreThreshold,
} as const;
