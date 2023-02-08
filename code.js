import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const GET_TRANSACTIONS = gql`
  query transactions($startDate: String!, $endDate: String!) {
    transactions(startDate: $startDate, endDate: $endDate) {
      customerId
      amount
      date
    }
  }
`;

const RewardPoints = ({ startDate, endDate }) => {
  const [rewardPoints, setRewardPoints] = useState({});

  const { data, loading, error } = useQuery(GET_TRANSACTIONS, {
    variables: { startDate, endDate },
  });

  useEffect(() => {
    if (!loading && !error) {
      const customerRewards = {};
      data.transactions.forEach(transaction => {
        const customerId = transaction.customerId;
        const amount = transaction.amount;
        const date = transaction.date;
        const month = date.substr(0, 7);
        if (!customerRewards[customerId]) {
          customerRewards[customerId] = {};
        }
        if (!customerRewards[customerId][month]) {
          customerRewards[customerId][month] = 0;
        }
        if (amount > 100) {
          customerRewards[customerId][month] += 2 * (amount - 100) + (amount > 50 ? 50 : 0);
        } else if (amount > 50) {
          customerRewards[customerId][month] += 1 * (amount - 50);
        }
      });
      setRewardPoints(customerRewards);
    }
  }, [data, loading, error]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div>
      {Object.keys(rewardPoints).map(customerId => (
        <div key={customerId}>
          <h2>Customer: {customerId}</h2>
          {Object.keys(rewardPoints[customerId]).map(month => (
            <p key={month}>
              Month: {month} - Points: {rewardPoints[customerId][month]}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RewardPoints;
