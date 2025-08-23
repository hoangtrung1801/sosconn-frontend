import { SERVER_URL } from "@/config/app.ts";
import HttpStatusCode from "@/constants/httpStatusCode.enum";
import {
  URL_LOGIN,
  URL_LOGOUT,
  URL_SESSION_ACCESS_TOKEN,
  URL_SIGNUP,
} from "@/lib/api/auth.api.ts";
import { isAxiosUnauthorizedError } from "@/lib/axios.ts";
import { AuthResponse } from "@/types/auth.type";
import axios, { AxiosError, type AxiosInstance } from "axios";
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS,
} from "./auth";
import { ErrorResponse } from "@/types/utils.type";

export class Http {
  instance: AxiosInstance;
  private token: string;
  private refreshToken: string;

  constructor(baseUrl?: string) {
    const serverUrl = baseUrl ? baseUrl : SERVER_URL;
    console.log("Server URL: ", serverUrl, baseUrl);

    this.token = getAccessTokenFromLS();
    this.refreshToken = getRefreshTokenFromLS();
    this.instance = axios.create({
      baseURL: `${serverUrl}/api`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.token && config.headers) {
          config.headers.authorization = `Bearer ${this.token}`;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        console.log({ url });
        if (url === URL_LOGIN || url === URL_SIGNUP) {
          const data = response.data as AuthResponse;
          this.token = data.accessToken.accessToken;
          this.refreshToken = data.accessToken.refreshToken;
          setAccessTokenToLS(this.token);
          setRefreshTokenToLS(this.refreshToken);
        } else if (url === URL_LOGOUT) {
          this.token = "";
          this.refreshToken = "";
          clearLS();
        } else if (url === URL_SESSION_ACCESS_TOKEN) {
          const data = response.data;
          this.token = data.access_token;
          setAccessTokenToLS(this.token);
        }
        return response;
      },
      (error: AxiosError) => {
        // Only toast errors which are not 422 and 401
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
          ].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          console.log(`Error ${message}`);
        }

        // Unauthorized (401) has many cases
        // - Token is not correct
        // - Token is not passed
        // - Token is expired

        // If 401
        if (
          isAxiosUnauthorizedError<
            ErrorResponse<{ name: string; message: string }>
          >(error)
        ) {
          // const config = error.response?.config;
          // If Token is expired and that request does not belong to the request refresh token
          // we will call refresh token
          // if (
          //   isAxiosExpiredTokenError(error) &&
          //   config?.url !== URL_REFRESH_TOKEN
          // ) {
          //   // Try not to call handleRefreshToken twice
          //   this.refreshTokenRequest = this.refreshTokenRequest
          //     ? this.refreshTokenRequest
          //     : this.handleRefreshToken().finally(() => {
          //         setTimeout(() => {
          //           this.refreshTokenRequest = null;
          //         }, 10000);
          //       });
          //   return this.refreshTokenRequest.then((token) => {
          //     return this.instance({
          //       ...config,
          //       headers: { ...config?.headers, authorization: token },
          //     });
          //   });
          // }

          // If token is not correct or is not passed or expired but failed to call the refresh token
          // we will clear the local storage and toast

          clearLS();
          this.token = "";
          this.refreshToken = "";
          // Fix: error.response.data is of type 'unknown', so we need to safely access its properties
          let errorMessage = error.message;
          const responseData = error.response?.data;
          if (responseData && typeof responseData === "object") {
            // Try to access nested message properties safely
            const dataField = (responseData as any).data;
            if (
              dataField &&
              typeof dataField === "object" &&
              "message" in dataField
            ) {
              errorMessage = (dataField as any).message;
            } else if ("message" in responseData) {
              errorMessage = (responseData as any).message;
            }
          }
          console.log(`Error ${errorMessage}`);
          // window.location.reload()
          return Promise.reject(error);
        }
      }
    );
  }
}

const request = new Http().instance;
export default request;
