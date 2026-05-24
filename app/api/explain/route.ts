import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { calculatorType, inputs, results, language = "en" } = await req.json();

    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.GOOGLE_API_KEY;

    const inputString = Object.entries(inputs)
      .map(([key, val]) => `${key}: ${typeof val === "number" ? formatRupees(val) : val}`)
      .join("\n");

    const resultString = Object.entries(results)
      .map(([key, val]) => `${key}: ${typeof val === "number" ? formatRupees(val) : val}`)
      .join("\n");

    const systemPrompt = `You are an elite Indian financial advisor.
Explain the calculator results in simple, engaging language.
You MUST provide the following 4 sections clearly labeled:
1. MEANING: Translate these numbers into a simple real-life explanation.
2. RISK LEVEL: Evaluate the risk (Low/Moderate/High) in the Indian context (inflation, job stability, market volatility).
3. ACTIONABLE NEXT STEPS: Give 2 clear actions they should take right now.
4. OPTIMIZATION TIPS: Share 1 pro-tip to save taxes, earn more interest, or compound faster.

Language request: ${language === "hi" ? "Hinglish (Hindi written in English letters with high-quality friendly Indian advice)" : "Simple plain English (India-focused)"}.
Keep the entire response under 140 words. Avoid financial jargon. Do not use markdown bullet lists, just simple readable short paragraphs.`;

    const userPrompt = `Calculator Type: ${calculatorType}
Inputs:
${inputString}

Results:
${resultString}`;

    if (!apiKey) {
      const mockAdvice = getMockFinancialAdvice(calculatorType, inputs, results, language);
      return NextResponse.json({ explanation: mockAdvice, source: "offline-advisor-engine" });
    }

    // Use DeepSeek API (OpenAI-compatible)
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const explanationText = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ explanation: explanationText, source: "deepseek-ai" });

  } catch (error: any) {
    console.error("AI Explanation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation", details: error.message },
      { status: 500 }
    );
  }
}

function formatRupees(num: number): string {
  return "₹" + num.toLocaleString("en-IN");
}

function getMockFinancialAdvice(
  type: string,
  inputs: any,
  results: any,
  language: string
): string {
  const isHi = language === "hi";

  if (type === "EMI") {
    const emi = results.monthlyEMI || 0;
    const rate = inputs.interestRate || 8.5;
    if (isHi) {
      return `1. MEANING: Aapka EMI monthly budget se ₹${emi.toLocaleString("en-IN")} deduct karega. Interest rate ${rate}% standard hai par total interest payment heavy ho sakti hai.
2. RISK LEVEL: Moderate. Agar aapki in-hand salary ka 35% se zyada EMI me ja raha hai, to budget tight ho sakta hai.
3. NEXT STEPS: Emergency fund me kam se kam 6 months ka EMI ready rakhein. Har saal 5% prepayment karne ka plan banayein.
4. OPTIMIZATION TIP: SBI ya HDFC Maxgain jaise overdraft loan options explore karein jisse interest burden kam ho sake.`;
    } else {
      return `1. MEANING: Your monthly EMI is ₹${emi.toLocaleString("en-IN")}. While home ownership or vehicle acquisition is a key asset, paying ${rate}% interest over a long tenure leads to a massive interest outflow.
2. RISK LEVEL: Moderate. If this EMI is more than 35% of your take-home income, you are at risk during sudden job changes or medical emergencies.
3. ACTIONABLE NEXT STEPS: Maintain 6 months of EMIs in a liquid bank account. Schedule a calendar reminder for prepayments.
4. OPTIMIZATION TIPS: Make 1 extra EMI payment every year. This single action can shave off 4 to 5 years from your total loan tenure!`;
    }
  }

  if (type === "SIP") {
    const total = results.totalValue || 0;
    const profit = results.estimatedReturns || 0;
    if (isHi) {
      return `1. MEANING: Aapka ₹${(inputs.monthlyInvestment || 10000).toLocaleString("en-IN")} ka monthly SIP long term me ₹${total.toLocaleString("en-IN")} ban sakta hai, jisme ₹${profit.toLocaleString("en-IN")} pure returns hain!
2. RISK LEVEL: Low to Moderate. Equity markets daily fluctuate hote hain, par long-term (7+ years) me risk bohot kam ho jata hai.
3. NEXT STEPS: Apne SIP ko 'set-and-forget' mode par dalein. Automatic bank auto-deduct (NACH) enable rakhein.
4. OPTIMIZATION TIP: Har saal apni income badhne par SIP amount ko 10% se badhayein (Step-up SIP). Isse aapka corpus double speed se grow hoga!`;
    } else {
      return `1. MEANING: Investing ₹${(inputs.monthlyInvestment || 5000).toLocaleString("en-IN")} monthly accumulates ₹${total.toLocaleString("en-IN")} over time. Out of this, ₹${profit.toLocaleString("en-IN")} is wealth generated entirely by compounding.
2. RISK LEVEL: Low (for long-term 7+ years). Short-term market corrections are normal, but historical Indian Index returns are solid at 12-15%.
3. ACTIONABLE NEXT STEPS: Automate your monthly investments via ECS. Avoid stopping SIPs during market downturns.
4. OPTIMIZATION TIPS: Use a "Step-up SIP" of 10% annually. It can increase your retirement corpus by up to 80% with minimal daily impact.`;
    }
  }

  if (type === "TAX") {
    const better = results.betterRegime || "new";
    const savings = results.taxSavings || 0;
    if (isHi) {
      return `1. MEANING: Humare calculation ke mutabiq aapke liye ${better.toUpperCase()} regime best hai. Isse aap ₹${savings.toLocaleString("en-IN")} tax bacha pa rahe hain!
2. RISK LEVEL: Low. Tax planning completely legal aur safe hai. Bas correct deductions declare karein.
3. NEXT STEPS: Agar aap Old select kar rahe hain, to Section 80C (PPF, ELSS) aur 80D (Health Insurance) me investment complete karein.
4. OPTIMIZATION TIP: New Regime me investment proof ka tension nahi hai. Wahan tax slabs lower hain, jisse disposable in-hand salary badhti hai.`;
    } else {
      return `1. MEANING: The comparison shows the ${better.toUpperCase()} tax regime is highly beneficial for you, saving you ₹${savings.toLocaleString("en-IN")} in tax outflow annually.
2. RISK LEVEL: Low. Optimizing tax is fully compliant under Indian Income Tax Act. Just ensure all declarations are supported by original bills.
3. ACTIONABLE NEXT STEPS: If Old is chosen, invest in Section 80C (ELSS, PPF) before March 31st. If New is chosen, enjoy higher cash liquidity.
4. OPTIMIZATION TIPS: Allocate tax savings directly into an Index Mutual Fund SIP to convert your tax-savings into future wealth!`;
    }
  }

  if (type === "SALARY") {
    const net = results.monthlyInHand || 0;
    if (isHi) {
      return `1. MEANING: Aapka CTC to In-Hand ratio solid hai. Har mahine aapko ₹${Math.round(net).toLocaleString("en-IN")} bank account me milenge. Deductions (EPF, Tax) future savings hain.
2. RISK LEVEL: Low. Government regulated deductions jaise EPF high interest aur 100% safety guarantee karte hain.
3. NEXT STEPS: Monthly budget banakar sabse pehle 20% savings/SIP side me rakhein, uske baad hi expenses karein.
4. OPTIMIZATION TIP: Employer EPF contribution badhane ke liye HR se Voluntary Provident Fund (VPF) ke baare me baat karein, tax-free returns milenge.`;
    } else {
      return `1. MEANING: Out of your CTC, your net monthly take-home is ₹${Math.round(net).toLocaleString("en-IN")}. The rest goes towards future savings (EPF, Gratuity) and government taxes.
2. RISK LEVEL: Low. EPF contributions are completely secure and earn excellent, guaranteed, tax-free compound interest of around 8.15-8.25%.
3. ACTIONABLE NEXT STEPS: Set up an automated sweep-in account in your bank to earn high interest on your idle monthly salary surplus.
4. OPTIMIZATION TIPS: Review if your company offers a flexible reimbursement structure (LTA, Food coupons) to lower your taxable Gross Salary further.`;
    }
  }

  if (type === "PREPAYMENT") {
    const saved = results.interestSaved || 0;
    const months = results.monthsSaved || 0;
    if (isHi) {
      return `1. MEANING: ₹${(inputs.monthlyPrepayment || 10000).toLocaleString("en-IN")} monthly extra pay karne se aap ₹${saved.toLocaleString("en-IN")} ka interest bacha rahe hain, aur aapka loan ${months} months pehle khatam ho jayega!
2. RISK LEVEL: Low. Debt prepayment sabse safe financial move hai, kyunki ye guaranteed risk-free return (interest saved) deta hai.
3. NEXT STEPS: Apne bank se contact karein aur monthly prepayment auto-debit set up karein. Check karein ki koi prepayment penalty to nahi hai.
4. OPTIMIZATION TIP: Home loan rate of interest high ho (9%+), to prepayment priority honi chahiye. Low-rate loans (7% below) me capital market me invest karna better hai.`;
    } else {
      return `1. MEANING: Prepaying an extra ₹${(inputs.monthlyPrepayment || 10000).toLocaleString("en-IN")} monthly reduces your total interest by ₹${saved.toLocaleString("en-IN")} and cuts your loan tenure shorter by ${months} months.
2. RISK LEVEL: Low. Loan prepayment represents a risk-free, guaranteed return equivalent to your interest rate (typically 8.5-9.5%).
3. ACTIONABLE NEXT STEPS: Contact your bank branch and link a standing instruction for your prepayment. Verify that prepayments apply directly to the Principal.
4. OPTIMIZATION TIPS: Avoid taking personal or car loans to prepay home loans. Focus on small, incremental, regular monthly prepayments for maximum compounding relief.`;
    }
  }

  return "An excellent financial scenario! Let's optimize this with regular investments and smart tax deductions.";
}
