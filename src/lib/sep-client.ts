const SEP_TOKEN_URL =
  process.env.SEP_TOKEN_URL ||
  "https://sep.shaparak.ir/onlinepg/onlinepg";
const SEP_VERIFY_URL =
  process.env.SEP_VERIFY_URL ||
  "https://sep.shaparak.ir/verifyTxnRandomSessionkey/ipg/VerifyTransaction";
const SEP_PAYMENT_URL =
  process.env.SEP_PAYMENT_URL ||
  "https://sep.shaparak.ir/OnlinePG/OnlinePG";

export interface SEPTokenRequest {
  Action: string;
  TerminalId: string;
  Amount: number;
  ResNum: string;
  RedirectUrl: string;
  CellNumber?: string;
  TokenExpiryInMin?: number;
}

export interface SEPTokenResponse {
  status: number;
  token?: string;
  errorCode?: string;
  errorDesc?: string;
}

export interface SEPVerifyRequest {
  RefNum: string;
  TerminalNumber: number;
}

export interface SEPVerifyResponse {
  TransactionDetail?: {
    RRN: string;
    RefNum: string;
    MaskedPan: string;
    HashedPan: string;
    TerminalNumber: number;
    OrginalAmount: number;
    AffectiveAmount: number;
    StraceDate: string;
    StraceNo: string;
  };
  ResultCode: number;
  ResultDescription: string;
  Success: boolean;
}

/**
 * Request a token from SEP gateway
 */
export async function requestSEPToken(
  params: SEPTokenRequest,
): Promise<SEPTokenResponse> {
  try {
    const response = await fetch(SEP_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`SEP API error: ${response.status}`);
    }

    const data: SEPTokenResponse = await response.json();
    return data;
  } catch (error) {
    console.error("SEP token request error:", error);
    throw error;
  }
}

/**
 * Verify a transaction with SEP gateway
 */
export async function verifySEPTransaction(
  params: SEPVerifyRequest,
): Promise<SEPVerifyResponse> {
  try {
    const response = await fetch(SEP_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`SEP verify API error: ${response.status}`);
    }

    const data: SEPVerifyResponse = await response.json();
    return data;
  } catch (error) {
    console.error("SEP verify error:", error);
    throw error;
  }
}

/**
 * Get payment redirect URL
 */
export function getSEPPaymentUrl(token: string): string {
  return `${SEP_PAYMENT_URL}?token=${token}`;
}

