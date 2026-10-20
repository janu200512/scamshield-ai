import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeWithRules, getRiskLevel, getScamType, extractAllUrls } from './analyzer.ts';
import { runBenchmark } from './benchmark.ts';

test('analyzeWithRules flags high risk for urgency and OTP request', () => {
  const input = "URGENT: Your bank account will be blocked in 30 minutes. Complete KYC immediately and share your OTP.";
  const result = analyzeWithRules(input);
  
  assert.equal(result.riskLevel, 'HIGH');
  assert.ok(result.riskScore >= 60, `Risk score ${result.riskScore} should be >= 60`);
  assert.equal(result.scamType, 'BANKING');
  assert.ok(result.redFlags.some(f => f.title === 'Urgency or pressure'));
  assert.ok(result.redFlags.some(f => f.title === 'Credential or OTP request'));
  assert.ok(result.recommendedActions.length > 0);
});

test('analyzeWithRules flags job scam with fee demands', () => {
  const input = "Congratulations! You are selected for a remote job earning ₹8,000 per day. Pay a refundable registration fee today.";
  const result = analyzeWithRules(input);
  
  assert.ok(result.riskScore >= 40, `Score ${result.riskScore} should be >= 40`);
  assert.equal(result.scamType, 'JOB');
  assert.ok(result.redFlags.some(f => f.title.includes('Payment or fee demand')));
  assert.ok(result.redFlags.some(f => f.title.includes('Unusually attractive offer')));
});

test('analyzeWithRules marks normal friendly messages as LOW risk', () => {
  const input = "Hi, our study group meeting is moved to 4 PM tomorrow. Please bring your notes. Thanks!";
  const result = analyzeWithRules(input);
  
  assert.equal(result.riskLevel, 'LOW');
  assert.ok(result.riskScore < 30, `Score ${result.riskScore} should be < 30`);
  assert.equal(result.redFlags.length, 0);
});

test('extractAllUrls detects standard and shortened URLs', () => {
  const text = "Visit http://sbi-secure.xyz and also bit.ly/parcel-update for details.";
  const urls = extractAllUrls(text);
  
  assert.ok(urls.some(u => u.includes('sbi-secure.xyz')));
  assert.ok(urls.some(u => u.includes('bit.ly/parcel-update')));
});

test('getRiskLevel maps score brackets accurately', () => {
  assert.equal(getRiskLevel(90), 'HIGH');
  assert.equal(getRiskLevel(65), 'SUSPICIOUS');
  assert.equal(getRiskLevel(40), 'MEDIUM');
  assert.equal(getRiskLevel(15), 'LOW');
});

test('runBenchmark achieves 100% detection on the 20 benchmark test cases', () => {
  const benchmark = runBenchmark();
  
  assert.equal(benchmark.totalCases, 20);
  assert.equal(benchmark.scamCases, 10);
  assert.equal(benchmark.legitimateCases, 10);
  
  // All 10 scams should be caught (TP = 10, FN = 0)
  assert.equal(benchmark.falseNegatives, 0, `False negatives should be 0, got ${benchmark.falseNegatives}`);
  assert.equal(benchmark.truePositives, 10, `True positives should be 10, got ${benchmark.truePositives}`);
  
  // All 10 legitimate messages should be cleared (TN = 10, FP = 0)
  assert.equal(benchmark.falsePositives, 0, `False positives should be 0, got ${benchmark.falsePositives}`);
  assert.equal(benchmark.trueNegatives, 10, `True negatives should be 10, got ${benchmark.trueNegatives}`);
  
  assert.equal(benchmark.accuracy, 100);
  assert.equal(benchmark.precision, 100);
  assert.equal(benchmark.recall, 100);
  assert.equal(benchmark.f1Score, 100);
});
