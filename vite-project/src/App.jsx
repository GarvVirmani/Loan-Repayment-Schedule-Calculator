import React, { useState } from 'react';
import './App.css';

function App() {
  const [disbursementDate, setDisbursementDate] = useState('');
  const [principal, setPrincipal] = useState('');
  const [tenure, setTenure] = useState('');
  const [emiFrequency, setEmiFrequency] = useState('Monthly');
  const [interestRate, setInterestRate] = useState('');
  const [moratoriumPeriod, setMoratoriumPeriod] = useState('');
  const [schedule, setSchedule] = useState([]);

  const calculateSchedule = (e) => {
    e.preventDefault();

    const principalAmount = parseFloat(principal);
    const annualInterestRate = parseFloat(interestRate) / 100;
    const totalPeriods = parseInt(tenure, 10);
    const moratorium = parseInt(moratoriumPeriod, 10);

    if (principalAmount < 0 ||
      annualInterestRate < 0 ||
      totalPeriods < 0 ||
      moratorium < 0
    ) {
      alert("Please enter non-negative values for all numeric inputs.");
      return;
    }

    if (moratorium > totalPeriods) {
      alert("Moratorium period cannot be greater than the total tenure.");
      return;
    }

    let EMI, scheduleArray = [], currentBalance;

    if (emiFrequency === 'Monthly') {
      const monthlyInterestRate = annualInterestRate / 12;
      const periodsAfterMoratorium = totalPeriods - moratorium;
      const principalAfterMoratorium = principalAmount * Math.pow(1 + monthlyInterestRate, moratorium);

      EMI =
        (principalAfterMoratorium *
          monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, periodsAfterMoratorium)) /
        (Math.pow(1 + monthlyInterestRate, periodsAfterMoratorium) - 1);

      currentBalance = principalAfterMoratorium;
      let paymentDate = new Date(disbursementDate);
      paymentDate.setMonth(paymentDate.getMonth() + moratorium);

      for (let i = 1; i <= periodsAfterMoratorium; i++) {
        let interestComponent = currentBalance * monthlyInterestRate;
        let principalComponent = EMI - interestComponent;
        currentBalance -= principalComponent;

        scheduleArray.push({
          installment: i,
          paymentDate: new Date(paymentDate),
          EMI: EMI.toFixed(2),
          interest: interestComponent.toFixed(2),
          principal: principalComponent.toFixed(2),
          balance: currentBalance > 0 ? currentBalance.toFixed(2) : '0.00',
        });

        paymentDate.setMonth(paymentDate.getMonth() + 1);
      }
    } else if (emiFrequency === 'Quarterly') {
      if ((totalPeriods - moratorium) % 3 !== 0) {
        alert("For quarterly payments, the remaining tenure (tenure minus moratorium) must be divisible by 3.");
        return;
      }
      const quarterlyInterestRate = annualInterestRate / 4;
      const moratoriumQuarters = moratorium / 3;
      const periodsAfterMoratorium = (totalPeriods - moratorium) / 3;
      const principalAfterMoratorium = principalAmount * Math.pow(1 + quarterlyInterestRate, moratoriumQuarters);

      EMI =
        (principalAfterMoratorium *
          quarterlyInterestRate *
          Math.pow(1 + quarterlyInterestRate, periodsAfterMoratorium)) /
        (Math.pow(1 + quarterlyInterestRate, periodsAfterMoratorium) - 1);

      currentBalance = principalAfterMoratorium;
      let paymentDate = new Date(disbursementDate);
      paymentDate.setMonth(paymentDate.getMonth() + moratorium);

      for (let i = 1; i <= periodsAfterMoratorium; i++) {
        let interestComponent = currentBalance * quarterlyInterestRate;
        let principalComponent = EMI - interestComponent;
        currentBalance -= principalComponent;

        scheduleArray.push({
          installment: i,
          paymentDate: new Date(paymentDate),
          EMI: EMI.toFixed(2),
          interest: interestComponent.toFixed(2),
          principal: principalComponent.toFixed(2),
          balance: currentBalance > 0 ? currentBalance.toFixed(2) : '0.00',
        });
        paymentDate.setMonth(paymentDate.getMonth() + 3);
      }
    }

    setSchedule(scheduleArray);
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2>Loan Repayment Schedule Calculator</h2>
      <form onSubmit={calculateSchedule} style={{ marginBottom: '20px' }}>
        <div>
          <label>Disbursement Date:</label>
          <input
            type="date"
            value={disbursementDate}
            onChange={(e) => setDisbursementDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Principal Amount:</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tenure (in months):</label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            required
          />
        </div>
        <div>
          <label>EMI Frequency:</label>
          <select
            value={emiFrequency}
            onChange={(e) => setEmiFrequency(e.target.value)}
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
          </select>
        </div>
        <div>
          <label>Interest Rate (annual %):</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Moratorium Period (in months):</label>
          <input
            type="number"
            value={moratoriumPeriod}
            onChange={(e) => setMoratoriumPeriod(e.target.value)}
            required
          />
        </div>
        <button type="submit">Generate Schedule</button>
      </form>

      {schedule.length > 0 && (
        <table border="1" cellPadding="5" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Installment</th>
              <th>Payment Date</th>
              <th>EMI</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, index) => (
              <tr key={index}>
                <td>{item.installment}</td>
                <td>{new Date(item.paymentDate).toLocaleDateString()}</td>
                <td>{item.EMI}</td>
                <td>{item.principal}</td>
                <td>{item.interest}</td>
                <td>{item.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;