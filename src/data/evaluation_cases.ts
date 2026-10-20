import type { EvaluationCase } from '../types/analysis.ts';

export const EVALUATION_CASES: EvaluationCase[] = [
  {
    id: "S01",
    label: "scam",
    category: "banking",
    input: "URGENT: Your bank account will be blocked in 30 minutes. Complete KYC immediately at http://sbi-secure-login.xyz and share your OTP to avoid suspension."
  },
  {
    id: "S02",
    label: "scam",
    category: "job",
    input: "Congratulations! You are selected for a remote job earning ₹8,000 per day. Pay a refundable registration fee today to secure your position."
  },
  {
    id: "S03",
    label: "scam",
    category: "delivery",
    input: "Your parcel is on hold. Pay a small rescheduling fee now using this link: http://bit.ly/parcel-update or your delivery will be cancelled."
  },
  {
    id: "S04",
    label: "scam",
    category: "lottery",
    input: "You have won ₹50,000! Click now to claim your prize before it expires. Processing fee required."
  },
  {
    id: "S05",
    label: "scam",
    category: "investment",
    input: "Double your money in 7 days with guaranteed risk-free returns. Deposit now to unlock your profit."
  },
  {
    id: "S06",
    label: "scam",
    category: "phishing",
    input: "Verify your password immediately or your account will be suspended. Login here: http://192.168.2.22/verify"
  },
  {
    id: "S07",
    label: "scam",
    category: "payment",
    input: "Your electricity service will be disconnected today. Pay now using this shortened link to avoid legal action."
  },
  {
    id: "S08",
    label: "scam",
    category: "tech_support",
    input: "Virus detected on your computer. Call our technical support immediately and install remote access software."
  },
  {
    id: "S09",
    label: "scam",
    category: "banking",
    input: "Your KYC update is pending. Send your card number, CVV and OTP to reactivate your bank account."
  },
  {
    id: "S10",
    label: "scam",
    category: "job",
    input: "Work from home and earn guaranteed ₹10,000 daily. Pay a registration fee before the interview."
  },
  {
    id: "L01",
    label: "legitimate",
    category: "ordinary",
    input: "Hi, our study group meeting is moved to 4 PM tomorrow. Please bring your notes. Thanks!"
  },
  {
    id: "L02",
    label: "legitimate",
    category: "ordinary",
    input: "Your library book is due next Monday. Please return it at the front desk during opening hours."
  },
  {
    id: "L03",
    label: "legitimate",
    category: "ordinary",
    input: "Reminder: the engineering lecture starts at 10 AM in Room 204. Bring your notebook."
  },
  {
    id: "L04",
    label: "legitimate",
    category: "ordinary",
    input: "Thanks for your order. Your receipt is available in the shopping app. Open the app directly to view it."
  },
  {
    id: "L05",
    label: "legitimate",
    category: "ordinary",
    input: "Your appointment is confirmed for Thursday at 3 PM. Call the clinic using the number on its official website if you need to reschedule."
  },
  {
    id: "L06",
    label: "legitimate",
    category: "ordinary",
    input: "Hi, I shared the project notes in our class group. Let me know if you cannot access the file."
  },
  {
    id: "L07",
    label: "legitimate",
    category: "ordinary",
    input: "Your payment was received. You can view the transaction details by opening your bank's official app yourself."
  },
  {
    id: "L08",
    label: "legitimate",
    category: "ordinary",
    input: "The college office will be closed on Friday for a public holiday. Regular hours resume Monday."
  },
  {
    id: "L09",
    label: "legitimate",
    category: "ordinary",
    input: "Meeting link for our team call is in the calendar invite. Please join at the scheduled time."
  },
  {
    id: "L10",
    label: "legitimate",
    category: "ordinary",
    input: "Your parcel has been delivered to the reception desk. Please collect it when convenient."
  }
];
