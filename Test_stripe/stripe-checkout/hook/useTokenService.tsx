import { useState, useCallback } from "react";

interface TokenService {
  grantTokens: (amount: number) => void;
  deductTokens: (amount: number) => void;
  balance: number;
}

const useTokenService = (initialBalance = 0): TokenService => {
  const [balance, setBalance] = useState(initialBalance);

  const grantTokens = useCallback((amount: number) => {
    setBalance((prevBalance) => prevBalance + amount);
  }, []);

  const deductTokens = useCallback((amount: number) => {
    setBalance((prevBalance) => prevBalance - amount);
  }, []);

  return { grantTokens, deductTokens, balance };
};

export default useTokenService;
