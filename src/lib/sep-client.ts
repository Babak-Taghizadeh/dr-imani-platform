const SEP_TOKEN_URL = process.env.SEP_TOKEN_URL;
const SEP_VERIFY_URL = process.env.SEP_VERIFY_URL;
const SEP_PAYMENT_URL = process.env.SEP_PAYMENT_URL;

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
    const response = await fetch(SEP_TOKEN_URL!, {
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
 * Implements retry logic with exponential backoff as per SEP documentation
 * Retries up to 3 times for network errors, but not for definitive API errors
 */
export async function verifySEPTransaction(
  params: SEPVerifyRequest,
  maxRetries = 3,
): Promise<SEPVerifyResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(SEP_VERIFY_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`SEP verify API error: ${response.status}`);
      }

      const data: SEPVerifyResponse = await response.json();

      // If we get a definitive error (not network/timeout), don't retry
      // ResultCode < 0 indicates errors, but -6 is timeout-related (over 30 min)
      // We should retry for -6 if it's a network issue, but not for other errors
      if (data.ResultCode < 0 && data.ResultCode !== -6) {
        return data; // Return the error response, don't retry
      }

      // Success or retryable error
      return data;
    } catch (error) {
      lastError = error as Error;
      const isAbortError =
        error instanceof Error && error.name === "AbortError";
      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof Error && error.message.includes("fetch"));

      // Only retry on network errors or timeouts
      if (attempt < maxRetries - 1 && (isAbortError || isNetworkError)) {
        const delay = 1000 * Math.pow(2, attempt); // Exponential backoff: 1s, 2s, 4s
        console.warn(
          `SEP verify attempt ${attempt + 1} failed, retrying in ${delay}ms...`,
          error,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Last attempt or non-retryable error
      if (attempt === maxRetries - 1) {
        console.error("SEP verify failed after all retries:", error);
        throw error;
      }
    }
  }

  throw lastError || new Error("Verify failed after retries");
}

/**
 * Get payment redirect URL
 */
export function getSEPPaymentUrl(token: string): string {
  return `${SEP_PAYMENT_URL}?token=${token}`;
}
