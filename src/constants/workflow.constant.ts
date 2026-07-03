import { EmailSendType, RoleType } from "../utils/interfaces.util";


const ROLE: RoleType = {
    ADMIN: 1,
    SUB_ADMIN: 2,
    USER: 3,
};

const USER_STATUS = {
    ACTIVE: 1,
    DELETED: 2,
    DEACTIVATED: 3,
};


const DEACTIVATE_BY = {
    USER: 'user',
    ADMIN: 'admin',
};

const EMAIL_SEND_TYPE = EmailSendType

const languages = {
    ENGLISH: "en",
    // CHINESE: "zh",
    SPANISH: "es",
    FRENCH: "fr",
    // HINDI: "hi",
    GERMAN: "de",
    RUSSIAN: "ru",
    PORTUGUESE: "pt",
    ITALIAN: "it",
    // ROMANIAN: "ro"
}

const SUPPORTED_LANGUAGES = ["en","es", "fr", "de", "ru", "pt", "it"];

const bringsYouHereOptions = ['romantic relationship', 'family', 'friendship', 'loneliness', 'self confident', 'just need to talk'];
const howFellingLatelyOptions = ['Overwhelmed', 'Emotionally drained', 'Overthinking everything', 'Feeling stuck', 'Lost or unsure about life', 'Just looking for more clarity'];
const likeToFellMore = ['Peace of mind', 'Confidence', 'Emotional strength', 'Clarity about my life', 'Balance', 'Motivation'];
const timeYouCommit = ['Just 2 minutes', 'Around 5 minutes', '10 minutes or more', 'Only when I need it'];
const startShowingOfYourSelf = ['I’m just exploring for now', 'I’m willing to try', 'Yes, I’m ready to start'];



const questions = [
  {
    en: "How have you been feeling lately?",
    zh: "你最近感觉怎么样？",
    hi: "आप हाल ही में कैसा महसूस कर रहे हैं?",
    es: "¿Cómo te has sentido últimamente?",
    fr: "Comment vous sentez-vous ces derniers temps ?",
    de: "Wie hast du dich in letzter Zeit gefühlt?",
    ru: "Как вы себя чувствовали в последнее время?",
    pt: "Como você tem se sentido ultimamente?",
    it: "Come ti sei sentito ultimamente?",
    ro: "Cum te-ai simțit în ultima vreme?"
  },
  {
    en: "What’s been on your mind?",
    zh: "你最近在想什么？",
    hi: "हाल ही में आपके मन में क्या चल रहा है?",
    es: "¿Qué ha estado en tu mente?",
    fr: "Qu’est-ce qui vous préoccupe ?",
    de: "Was beschäftigt dich gerade?",
    ru: "Что у вас на уме?",
    pt: "O que tem passado pela sua cabeça?",
    it: "Cosa ti passa per la mente?",
    ro: "La ce te-ai gândit în ultima vreme?"
  },
  {
    en: "What’s hurting you right now?",
    zh: "现在什么让你感到痛苦？",
    hi: "इस समय आपको क्या दुख दे रहा है?",
    es: "¿Qué te está lastimando ahora mismo?",
    fr: "Qu’est-ce qui vous fait souffrir en ce moment ?",
    de: "Was tut dir gerade weh?",
    ru: "Что причиняет вам боль сейчас?",
    pt: "O que está te machucando agora?",
    it: "Cosa ti sta ferendo in questo momento?",
    ro: "Ce te doare acum?"
  },
  {
    en: "What makes you feel safe?",
    zh: "什么让你感到安全？",
    hi: "क्या चीज़ आपको सुरक्षित महसूस कराती है?",
    es: "¿Qué te hace sentir seguro?",
    fr: "Qu’est-ce qui vous fait vous sentir en sécurité ?",
    de: "Was gibt dir Sicherheit?",
    ru: "Что заставляет вас чувствовать себя в безопасности?",
    pt: "O que faz você se sentir seguro?",
    it: "Cosa ti fa sentire al sicuro?",
    ro: "Ce te face să te simți în siguranță?"
  },
  {
    en: "What are you avoiding?",
    zh: "你在逃避什么？",
    hi: "आप किस चीज़ से बच रहे हैं?",
    es: "¿Qué estás evitando?",
    fr: "Qu’est-ce que vous évitez ?",
    de: "Was vermeidest du?",
    ru: "Чего вы избегаете?",
    pt: "O que você está evitando?",
    it: "Cosa stai evitando?",
    ro: "Ce eviți?"
  },
  {
    en: "What do you miss most?",
    zh: "你最怀念什么？",
    hi: "आपको सबसे ज़्यादा किस चीज़ की कमी महसूस होती है?",
    es: "¿Qué extrañas más?",
    fr: "Qu’est-ce qui vous manque le plus ?",
    de: "Was vermisst du am meisten?",
    ru: "По чему вы скучаете больше всего?",
    pt: "Do que você sente mais falta?",
    it: "Cosa ti manca di più?",
    ro: "Ce îți lipsește cel mai mult?"
  },
  {
    en: "When do you feel alone?",
    zh: "你什么时候感到孤独？",
    hi: "आप कब अकेला महसूस करते हैं?",
    es: "¿Cuándo te sientes solo?",
    fr: "Quand vous sentez-vous seul ?",
    de: "Wann fühlst du dich allein?",
    ru: "Когда вы чувствуете себя одиноко?",
    pt: "Quando você se sente sozinho?",
    it: "Quando ti senti solo?",
    ro: "Când te simți singur?"
  },
  {
    en: "What drains your energy?",
    zh: "什么消耗你的精力？",
    hi: "क्या चीज़ आपकी ऊर्जा खत्म कर देती है?",
    es: "¿Qué agota tu energía?",
    fr: "Qu’est-ce qui épuise votre énergie ?",
    de: "Was raubt dir Energie?",
    ru: "Что забирает вашу энергию?",
    pt: "O que drena sua energia?",
    it: "Cosa prosciuga la tua energia?",
    ro: "Ce îți consumă energia?"
  },
  {
    en: "What brings you peace?",
    zh: "什么带给你平静？",
    hi: "क्या चीज़ आपको शांति देती है?",
    es: "¿Qué te da paz?",
    fr: "Qu’est-ce qui vous apporte la paix ?",
    de: "Was bringt dir Frieden?",
    ru: "Что приносит вам покой?",
    pt: "O que traz paz para você?",
    it: "Cosa ti porta pace?",
    ro: "Ce îți aduce liniște?"
  },
  {
    en: "What scares you lately?",
    zh: "最近什么让你害怕？",
    hi: "हाल ही में आपको किस बात से डर लगता है?",
    es: "¿Qué te asusta últimamente?",
    fr: "Qu’est-ce qui vous fait peur ces derniers temps ?",
    de: "Was macht dir in letzter Zeit Angst?",
    ru: "Что пугает вас в последнее время?",
    pt: "O que tem te assustado ultimamente?",
    it: "Cosa ti spaventa ultimamente?",
    ro: "Ce te sperie în ultima vreme?"
  },
  {
    en: "What are you holding in?",
    zh: "你在压抑什么？",
    hi: "आप क्या अंदर दबाकर रखे हुए हैं?",
    es: "¿Qué estás guardando dentro?",
    fr: "Qu’est-ce que vous gardez en vous ?",
    de: "Was hältst du in dir fest?",
    ru: "Что вы держите в себе?",
    pt: "O que você está guardando para si?",
    it: "Cosa stai trattenendo dentro di te?",
    ro: "Ce ții în tine?"
  },
  {
    en: "What do you need most?",
    zh: "你最需要什么？",
    hi: "आपको सबसे ज़्यादा किस चीज़ की ज़रूरत है?",
    es: "¿Qué necesitas más?",
    fr: "De quoi avez-vous le plus besoin ?",
    de: "Was brauchst du am meisten?",
    ru: "Что вам нужно больше всего?",
    pt: "Do que você mais precisa?",
    it: "Di cosa hai più bisogno?",
    ro: "De ce ai cea mai mare nevoie?"
  },
  {
    en: "Who understands you best?",
    zh: "谁最理解你？",
    hi: "कौन आपको सबसे अच्छी तरह समझता है?",
    es: "¿Quién te entiende mejor?",
    fr: "Qui vous comprend le mieux ?",
    de: "Wer versteht dich am besten?",
    ru: "Кто понимает вас лучше всего?",
    pt: "Quem te entende melhor?",
    it: "Chi ti capisce meglio?",
    ro: "Cine te înțelege cel mai bine?"
  },
  {
    en: "What keeps you going?",
    zh: "是什么让你坚持下去？",
    hi: "क्या चीज़ आपको आगे बढ़ते रहने की ताकत देती है?",
    es: "¿Qué te mantiene adelante?",
    fr: "Qu’est-ce qui vous fait avancer ?",
    de: "Was hält dich am Laufen?",
    ru: "Что помогает вам двигаться дальше?",
    pt: "O que te faz continuar?",
    it: "Cosa ti fa andare avanti?",
    ro: "Ce te face să continui?"
  },
  {
    en: "What are you overthinking?",
    zh: "你在过度思考什么？",
    hi: "आप किस बात को लेकर ज़रूरत से ज़्यादा सोच रहे हैं?",
    es: "¿Qué estás pensando demasiado?",
    fr: "À quoi pensez-vous trop ?",
    de: "Worüber denkst du zu viel nach?",
    ru: "О чем вы слишком много думаете?",
    pt: "Sobre o que você está pensando demais?",
    it: "A cosa stai pensando troppo?",
    ro: "La ce te gândești prea mult?"
  },
  {
    en: "What makes you feel loved?",
    zh: "什么让你感受到被爱？",
    hi: "क्या चीज़ आपको प्यार महसूस कराती है?",
    es: "¿Qué te hace sentir amado?",
    fr: "Qu’est-ce qui vous fait sentir aimé ?",
    de: "Was gibt dir das Gefühl, geliebt zu werden?",
    ru: "Что заставляет вас чувствовать себя любимым?",
    pt: "O que faz você se sentir amado?",
    it: "Cosa ti fa sentire amato?",
    ro: "Ce te face să te simți iubit?"
  },
  {
    en: "What are you afraid to lose?",
    zh: "你害怕失去什么？",
    hi: "आप किस चीज़ को खोने से डरते हैं?",
    es: "¿Qué tienes miedo de perder?",
    fr: "Qu’avez-vous peur de perdre ?",
    de: "Was hast du Angst zu verlieren?",
    ru: "Что вы боитесь потерять?",
    pt: "O que você tem medo de perder?",
    it: "Cosa hai paura di perdere?",
    ro: "Ce ți-e frică să pierzi?"
  },
  {
    en: "What do you want to change?",
    zh: "你想改变什么？",
    hi: "आप क्या बदलना चाहते हैं?",
    es: "¿Qué quieres cambiar?",
    fr: "Que voulez-vous changer ?",
    de: "Was möchtest du ändern?",
    ru: "Что вы хотите изменить?",
    pt: "O que você quer mudar?",
    it: "Cosa vuoi cambiare?",
    ro: "Ce vrei să schimbi?"
  },
  {
    en: "What are you struggling with?",
    zh: "你正在为什么而挣扎？",
    hi: "आप किस संघर्ष से गुजर रहे हैं?",
    es: "¿Con qué estás luchando?",
    fr: "Avec quoi luttez-vous ?",
    de: "Womit kämpfst du?",
    ru: "С чем вы боретесь?",
    pt: "Com o que você está lutando?",
    it: "Con cosa stai lottando?",
    ro: "Cu ce te confrunți?"
  },
  {
    en: "What makes you feel seen?",
    zh: "什么让你感到被理解？",
    hi: "क्या चीज़ आपको महसूस कराती है कि लोग आपको समझते हैं?",
    es: "¿Qué te hace sentir visto?",
    fr: "Qu’est-ce qui vous fait vous sentir compris ?",
    de: "Was gibt dir das Gefühl, gesehen zu werden?",
    ru: "Что заставляет вас чувствовать себя замеченным?",
    pt: "O que faz você se sentir visto?",
    it: "Cosa ti fa sentire compreso?",
    ro: "Ce te face să te simți văzut?"
  },
  {
    en: "What do you regret most?",
    zh: "你最后悔什么？",
    hi: "आपको सबसे ज़्यादा किस बात का पछतावा है?",
    es: "¿Qué es lo que más lamentas?",
    fr: "Quel est votre plus grand regret ?",
    de: "Was bereust du am meisten?",
    ru: "О чем вы больше всего сожалеете?",
    pt: "Do que você mais se arrepende?",
    it: "Di cosa ti penti di più?",
    ro: "Ce regreți cel mai mult?"
  },
  {
    en: "What motivates you lately?",
    zh: "最近是什么激励着你？",
    hi: "हाल ही में आपको क्या प्रेरित कर रहा है?",
    es: "¿Qué te motiva últimamente?",
    fr: "Qu’est-ce qui vous motive ces derniers temps ?",
    de: "Was motiviert dich in letzter Zeit?",
    ru: "Что мотивирует вас в последнее время?",
    pt: "O que tem te motivado ultimamente?",
    it: "Cosa ti motiva ultimamente?",
    ro: "Ce te motivează în ultima vreme?"
  },
  {
    en: "What are you grateful for?",
    zh: "你感激什么？",
    hi: "आप किसके लिए आभारी हैं?",
    es: "¿Por qué estás agradecido?",
    fr: "De quoi êtes-vous reconnaissant ?",
    de: "Wofür bist du dankbar?",
    ru: "За что вы благодарны?",
    pt: "Pelo que você é grato?",
    it: "Per cosa sei grato?",
    ro: "Pentru ce ești recunoscător?"
  },
  {
    en: "What feels heavy today?",
    zh: "今天什么让你感到沉重？",
    hi: "आज क्या भारी लग रहा है?",
    es: "¿Qué se siente pesado hoy?",
    fr: "Qu’est-ce qui vous semble lourd aujourd’hui ?",
    de: "Was fühlt sich heute schwer an?",
    ru: "Что кажется тяжелым сегодня?",
    pt: "O que parece pesado hoje?",
    it: "Cosa ti pesa oggi?",
    ro: "Ce simți apăsător astăzi?"
  },
  {
    en: "What do you hide from others?",
    zh: "你对别人隐藏了什么？",
    hi: "आप दूसरों से क्या छुपाते हैं?",
    es: "¿Qué escondes de los demás?",
    fr: "Que cachez-vous aux autres ?",
    de: "Was verbirgst du vor anderen?",
    ru: "Что вы скрываете от других?",
    pt: "O que você esconde dos outros?",
    it: "Cosa nascondi agli altri?",
    ro: "Ce ascunzi de ceilalți?"
  },
  {
    en: "What helps you heal?",
    zh: "什么帮助你治愈自己？",
    hi: "क्या चीज़ आपको ठीक होने में मदद करती है?",
    es: "¿Qué te ayuda a sanar?",
    fr: "Qu’est-ce qui vous aide à guérir ?",
    de: "Was hilft dir beim Heilen?",
    ru: "Что помогает вам исцеляться?",
    pt: "O que ajuda você a se curar?",
    it: "Cosa ti aiuta a guarire?",
    ro: "Ce te ajută să te vindeci?"
  },
  {
    en: "What are you searching for?",
    zh: "你在寻找什么？",
    hi: "आप क्या खोज रहे हैं?",
    es: "¿Qué estás buscando?",
    fr: "Que recherchez-vous ?",
    de: "Wonach suchst du?",
    ru: "Что вы ищете?",
    pt: "O que você está procurando?",
    it: "Cosa stai cercando?",
    ro: "Ce cauți?"
  },
  {
    en: "What do you fear most?",
    zh: "你最害怕什么？",
    hi: "आपको सबसे ज़्यादा किस बात का डर है?",
    es: "¿Qué es lo que más temes?",
    fr: "Quelle est votre plus grande peur ?",
    de: "Wovor hast du am meisten Angst?",
    ru: "Чего вы боитесь больше всего?",
    pt: "Do que você mais tem medo?",
    it: "Di cosa hai più paura?",
    ro: "De ce ți-e cel mai frică?"
  },
  {
    en: "What makes you feel alive?",
    zh: "什么让你感到充满活力？",
    hi: "क्या चीज़ आपको जीवंत महसूस कराती है?",
    es: "¿Qué te hace sentir vivo?",
    fr: "Qu’est-ce qui vous fait sentir vivant ?",
    de: "Was lässt dich lebendig fühlen?",
    ru: "Что заставляет вас чувствовать себя живым?",
    pt: "O que faz você se sentir vivo?",
    it: "Cosa ti fa sentire vivo?",
    ro: "Ce te face să te simți viu?"
  },
  {
    en: "What does your heart need?",
    zh: "你的内心需要什么？",
    hi: "आपके दिल को किस चीज़ की ज़रूरत है?",
    es: "¿Qué necesita tu corazón?",
    fr: "De quoi votre cœur a-t-il besoin ?",
    de: "Was braucht dein Herz?",
    ru: "Что нужно вашему сердцу?",
    pt: "Do que seu coração precisa?",
    it: "Di cosa ha bisogno il tuo cuore?",
    ro: "De ce are nevoie inima ta?"
  }
];

export {
    ROLE,
    USER_STATUS,
    DEACTIVATE_BY,
    EMAIL_SEND_TYPE,
    languages,
    SUPPORTED_LANGUAGES,
    bringsYouHereOptions,
    howFellingLatelyOptions,
    likeToFellMore,
    timeYouCommit,
    startShowingOfYourSelf,
    questions
};

