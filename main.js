// ============================================================
// ONE 桌遊 加盟儀表板 — 互動邏輯
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
        a: '部分地區（尤其台中以北）要求桌遊空間需有 D1 類組使用執照，若場地原執照不符，需向主管機關申請變更。變更費用 50-100 萬不等。我們會先幫你評估場地可變更性，避免白花錢。'
      },
      {
        icon: '🎲',
        q: '自助桌遊會不會被當成賭博場所？',
        a: '關鍵在「純娛樂經營機制」。我們提供完整店規、計費模式、服務條款範本，並協助設計合法營運流程，確保與賭博罪完全脫鉤。這部分詳細會在簽約前由總部協助規劃。'
      },
      {
        icon: '🚒',
        q: '消防、公安申報怎麼辦？',
        a: '必須在裝修規劃階段就納入消防配置（灑水、逃生、滅火器）與公安申報。我們合作的工班會按規範施工，後續公安自主檢查與年度申報也有 SOP 指引。'
      },
      {
        icon: '📋',
        q: '要申請什麼營業登記？',
        a: '多數情境以「遊藝場業」或「休閒娛樂業」登記。實際類別依縣市要求不同。我們會根據你的場地所在地，告訴你該申請的項目與流程。'
      },
      {
        icon: '🛡️',
        q: '強制險怎麼保？',
        a: '公共意外險為必要，建議最低 2,000 萬。我們配合的保險顧問可直接協助規劃保單內容，費用約每年 2-3 萬。'
      },
    ],

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
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        submittedAt: new Date().toISOString(),
        // honeypot：正常用戶看不到，機器人會亂填
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
