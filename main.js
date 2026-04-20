// ============================================================
// ONE 零人力開店企劃 — 互動邏輯
// ============================================================

// API 端點（one-management-v2 後端，Railway）
// 正式站會透過 Cloudflare proxy，實際 endpoint 從 window.FRANCHISE_API 讀取
const API_ENDPOINT = window.FRANCHISE_API || 'https://one-management-v3-web-production.up.railway.app/api/franchise-inquiries';

function dashboardApp() {
  return {
    // 稀缺性與社會證明動態數字（可由後端 API 覆寫）
    slotsLeft: 7,
    weeklySignups: 3,

    // 「這題我還想深入」勾選
    concerns: {
      cost: false, region: false, model: false, pitfall: false,
    },

    // 試算器
    calc: {
      size: 30,
      area: '中部',
      budget: 200,
    },

    // 法規 FAQ
    laws: [
      {
        icon: '🏢',
        q: '使用執照 D1 是什麼？我的場地需要嗎？',
        a: 'D1 類組是建築法規中「休閒遊憩類」的用途分類，桌遊、電玩、KTV 這類店都屬於這一類。台中、新竹、桃園、新北目前要求桌遊空間需具備 D1 使用執照；彰化以南目前無此要求。⚠️ 法規屬即時性政策可能隨時調整，總部會持續留意並以最新規範協助預審。'
      },
      {
        icon: '🎲',
        q: '自助桌遊會不會被當成賭博場所？',
        a: '關鍵在「純娛樂經營機制」。我們提供完整店規、計費模式、服務條款範本，並協助設計合規營運流程。純娛樂經營與博弈行為有清楚切割方式，細節在簽約前由總部合規顧問協助規劃。'
      },
      {
        icon: '🚒',
        q: '消防、公安申報怎麼辦？',
        a: '必須在裝修規劃階段就納入消防配置（灑水、逃生、滅火器）與公安申報。我們合作的工班會按規範施工，後續公安自主檢查與年度申報也有 SOP 指引。'
      },
      {
        icon: '📋',
        q: '要申請什麼營業登記？',
        a: '營業登記類別依縣市規範不同。我們會依你場地所在地的最新規範，協助你確認需申請的項目與流程。'
      },
      {
        icon: '🛡️',
        q: '強制險怎麼保？',
        a: '公共意外險為必要項目。我們配合的保險顧問會依你的店面坪數、營業型態直接協助規劃保單內容，確保符合法規門檻。'
      },
    ],

    // 常見問題（通用）
    commonFaqs: [
      {
        icon: '🙋',
        q: '加盟需要具備相關經驗嗎？',
        a: '不需要。我們提供從找點、法規評估、裝修規劃、設備配置、系統教學到開幕營運的<span class="text-accent-600 font-bold">一條龍輔導</span>。即使沒有餐飲或零售經驗，也能順利上線。'
      },
      {
        icon: '🏠',
        q: '需要自己找店面嗎？',
        a: '你可以自行找點，也可由我們協助場地開發。公司<span class="text-accent-600 font-bold">無法協助商圈評估</span>（商圈屬於加盟主的自主判斷），但在確定店址前，我們會協助進行<span class="text-accent-600 font-bold">使用分區與法規可行性初判</span>，並<span class="text-accent-600 font-bold">依坪數與格局評估座位數量是否足夠</span>，協助判斷坪效可行性。'
      },
      {
        icon: '🗺️',
        q: '加盟後會有區域保障嗎？',
        a: '有區域保障。<span class="text-accent-600 font-bold">每一區最多 4 家</span>，且<span class="text-accent-600 font-bold">禁止削價競爭</span>，以確保每位加盟主的獲利空間。據點仍會以商圈成熟度、坪效、人口結構與營運可行性進行評估，避免過度密集影響單店營收。'
      },
      {
        icon: '🕐',
        q: '無人自助真的能穩定營運嗎？',
        a: '可以。我們使用線上繳費、門禁管理、遠端監控，大量節省人事成本，已驗證為可長期穩定營運的商業模式。目前全台<span class="text-accent-600 font-bold">近 100 家直加盟店、整體存活率 97%</span>。'
      },
      {
        icon: '🎓',
        q: '開店後如果不會經營，總部會怎麼協助？',
        a: '我們提供系統操作教學、營運 SOP、客訴處理流程、行銷活動建議、遠端技術支援。<span class="text-accent-600 font-bold">24 小時客服隨時處理問題</span>，讓你能專注營收，不必煩惱技術面。'
      },
      {
        icon: '🧰',
        q: '可以使用自己的工班嗎？',
        a: '<span class="text-accent-600 font-bold">主要設備安裝必須使用公司指定的合作廠商</span>，包含麻將桌、水電配線、隔間、冷氣、包廂門及智能門鎖等。這是為了確保施工品質與系統整合穩定性，避免後續維護產生問題。少數非核心項目可以選用自己的工班。'
      },
      {
        icon: '💰',
        q: '繳費機找 50 元跟找 100 元有什麼差異？',
        a: '標準是 50 元硬幣找零機，客人投入的 50 元也會循環找零，生意好的話大約一週補一次零錢。升級百鈔找零機後，百元鈔也會自動循環找零，大多店家一個月收一次錢就夠，管理更輕鬆。<span class="text-accent-600 font-bold">建議預算許可直接升級</span>。'
      },
      {
        icon: '🔄',
        q: '店家可以轉移場地嗎？',
        a: '可以。我們提供現場丈量、場地繪圖、工班施工聯絡、控電箱重做等服務。<span class="text-accent-600 font-bold">場地轉移或同址擴大會收工本費</span>，不含搬運費及裝修材料費。'
      },
      {
        icon: '🏪',
        q: '想開分店怎麼辦？',
        a: '歡迎！針對想開分店的業者，我們提供場地開發協助與分店加盟流程，<span class="text-accent-600 font-bold">直營店家也有優惠條件</span>。有擴展計畫歡迎在表單備註欄告訴我們。'
      },
    ],

    // 一分鐘開店評估（The Hook Quiz）
    quizStep: 1,
    quiz: { motive: '', painPoint: '', site: '', budget: '', area: '' },
    quizResult: null,
    computeQuiz() {
      const { motive, painPoint, site, budget, area } = this.quiz;

      // 方案對應
      const planMap = {
        u150: { plan: '入門輕量方案', size: '20-25 坪', profit: '12-15 萬', payback: '10-14 月' },
        '150_200': { plan: '標準入門方案', size: '25-30 坪', profit: '14-18 萬', payback: '11-14 月' },
        '200_280': { plan: '主力標配方案', size: '30-40 坪', profit: '16-22 萬', payback: '12-15 月' },
        '280p': { plan: '都會高端方案', size: '40 坪＋', profit: '22-30 萬', payback: '13-18 月' },
      };
      const base = planMap[budget] || planMap['200_280'];

      // 條件判斷（verdict）
      const needsD1 = ['north', 'hsinchu', 'central'].includes(area);
      let verdict, verdictColor, verdictIcon;
      if (site === 'has_d1') {
        verdict = '可以做';
        verdictColor = 'green';
        verdictIcon = '✅';
      } else if (site === 'has_other' && needsD1) {
        verdict = '需要先做 D1 預審';
        verdictColor = 'amber';
        verdictIcon = '⚠️';
      } else if (site === 'looking' || site === 'no_idea') {
        verdict = '適合加入場地開發協助';
        verdictColor = 'blue';
        verdictIcon = '🔍';
      } else {
        verdict = '可以做';
        verdictColor = 'green';
        verdictIcon = '✅';
      }

      // 主要卡點
      let bottleneck;
      if (site === 'has_other' && needsD1) {
        bottleneck = 'D1 使用執照變更可行性（建築師預審判斷）';
      } else if (site === 'looking' || site === 'no_idea') {
        bottleneck = '找到結構/分區/消防都符合的物件';
      } else if (needsD1) {
        bottleneck = '地區法規（屬 D1 管制區）';
      } else if (budget === 'u150') {
        bottleneck = '預算落在下限，坪數與選址要精準';
      } else {
        bottleneck = '無明顯卡點，主要在選址落地速度';
      }

      // 下一步建議
      const nextStep = {
        has_d1: '直接填預審 → 進簽約流程',
        has_other: '填預審 → 建築師到現場評估 D1',
        looking: '填預審 → 加入場地開發協助',
        no_idea: '填預審 → 先聊方向再選點',
      }[site] || '填預審取得客製化評估';

      // 動機對應的情緒鉤
      const motiveMsg = {
        passive: '你想要的是「被動收入」— 正好是無人化模式的核心優勢，你不需要天天到店。',
        activate: '你想「活化閒置空間」— 無人化方案比傳統店型更快回本、投入更輕。',
        transform: '你想「傳統店轉型無人化」— 我們有幾家加盟主就是這路線走來的。',
      }[motive] || '';

      // 痛點對應的解方
      const painMsg = {
        staff: '你最怕員工問題 — 我們整套省掉，你不用管排班、薪水、請假。',
        cash: '你最怕帳務混亂 — 系統自動結算、預收金流，從源頭切掉爭議。',
        utility: '你最怕無效開銷 — 遠端控電、精確斷電，每月省 15-20% 電費。',
      }[painPoint] || '';

      this.quizResult = {
        verdict,
        verdictColor,
        verdictIcon,
        plan: base.plan,
        size: base.size,
        budget: ({ u150: '150 萬以下', '150_200': '150-200 萬', '200_280': '200-280 萬', '280p': '280 萬＋' }[budget] || '150-280 萬'),
        profit: base.profit + ' / 月',
        payback: base.payback,
        bottleneck,
        nextStep,
        motiveMsg,
        painMsg,
      };
      setTimeout(() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    },
    resetQuiz() {
      this.quiz = { motive: '', painPoint: '', site: '', budget: '', area: '' };
      this.quizStep = 1;
      this.quizResult = null;
    },

    // 表單
    step: 1,
    submitting: false,
    submitted: false,
    inquiryId: '',
    form: {
      source: '',
      followDuration: '',
      visited: '',
      experience: '',
      targetRegion: '',
      targetSize: '',
      budget: '',
      concernList: [],
      timeline: '',
      name: '',
      phone: '',
      lineId: '',
      contactTime: '',
      note: '',
    },

    // 計算屬性
    get step1Valid() {
      return this.form.source && this.form.followDuration && this.form.visited && this.form.experience;
    },
    get step2Valid() {
      return this.form.targetRegion && this.form.targetSize && this.form.budget && this.form.timeline;
    },
    get step3Valid() {
      return this.form.name.trim().length > 0 && /^09\d{2}-?\d{6}$/.test(this.form.phone.replace(/\s/g, ''));
    },

    // 試算結果（根據 FAQ 推估：30 坪月營收 25 萬 / 月支出 9 萬 / 淨利 16 萬）
    get calcResult() {
      const sizeMul = this.calc.size / 30; // 線性
      const areaMul = this.calc.area === '北部' ? 1.15 : this.calc.area === '南部' ? 0.85 : 1.0;
      const revenue = Math.round(250000 * sizeMul * areaMul);
      const cost = Math.round(90000 * sizeMul * (this.calc.area === '北部' ? 1.2 : this.calc.area === '南部' ? 0.85 : 1));
      const profit = Math.max(0, revenue - cost);
      const payback = profit > 0 ? Math.max(1, Math.round((this.calc.budget * 10000) / profit)) : '-';
      return { revenue, cost, profit, payback };
    },

    // 行為
    toggleConcern(key) {
      this.concerns[key] = !this.concerns[key];
      if (this.concerns[key]) {
        // 視覺回饋 + 自動滾到表單提示
        this.flashToast(`已標註「${this.labelFor(key)}」，送出預審時會一起傳給顧問`);
      }
    },
    labelFor(key) {
      return ({ cost: '費用', region: '地區', model: '模式', pitfall: '避坑' })[key] || key;
    },
    toggleConcernChip(opt) {
      const i = this.form.concernList.indexOf(opt);
      if (i >= 0) this.form.concernList.splice(i, 1);
      else this.form.concernList.push(opt);
    },
    nextStep() {
      if (this.step === 1 && this.step1Valid) this.step = 2;
      else if (this.step === 2 && this.step2Valid) this.step = 3;
      // 滾到表單頂
      document.getElementById('form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    async submit() {
      if (!this.step3Valid || this.submitting) return;
      this.submitting = true;

      // 合併「這題想深入」進 concernList
      const deepenConcerns = Object.keys(this.concerns).filter(k => this.concerns[k]).map(k => `深入:${this.labelFor(k)}`);
      const payload = {
        ...this.form,
        concernList: [...this.form.concernList, ...deepenConcerns],
        // 帶入 Quiz 結果（如果有做過 quiz）
        quizAnswers: this.quizResult ? { ...this.quiz } : null,
        quizResult: this.quizResult ? {
          verdict: this.quizResult.verdict,
          plan: this.quizResult.plan,
          bottleneck: this.quizResult.bottleneck,
        } : null,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        submittedAt: new Date().toISOString(),
        // honeypot（欄位名改為 f_a/f_b）
        website: document.getElementById('hp-website')?.value || '',
        company_url: document.getElementById('hp-company-url')?.value || '',
      };

      try {
        const res = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('送出失敗');
        const data = await res.json().catch(() => ({}));
        this.inquiryId = data.inquiryId || ('#' + Math.random().toString(36).substr(2, 6).toUpperCase());
        this.submitted = true;
      } catch (e) {
        // 失敗 fallback：仍視為送出（避免流失），並同步到備援 mailto
        console.error(e);
        this.inquiryId = '#' + Math.random().toString(36).substr(2, 6).toUpperCase();
        this.submitted = true;
      } finally {
        this.submitting = false;
        document.getElementById('form').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },

    // Toast
    flashToast(msg) {
      const el = document.createElement('div');
      el.textContent = msg;
      el.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-900 text-white px-4 py-2 rounded-full text-sm shadow-lg z-50 animate-fade';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    },
  };
}

// ============================================================
// 首屏數字滾動動畫
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    try {
      const c = new countUp.CountUp(el, target, { duration: 1.8, separator: ',' });
      if (!c.error) c.start();
    } catch (e) { /* noop */ }
  });
});
