/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum TypesApplicationStatus {
  UpToDate = "Up-to-date",
  Ignored = "Ignored",
  Outdated = "Outdated",
  Error = "Error",
}

export interface ServerCheck {
  status: string;
}

export type TypesAppStats = Record<string, number>;

export interface TypesChartSummary {
  chart: string;
  error?: string;
  newTags?: string[];
  repoURL?: string;
  revision?: string;
  status?: TypesApplicationStatus;
  type?: string;
}

export interface TypesListApplicationRes {
  items: TypesSummary[];
  stats: TypesAppStats;
}

export interface TypesParent {
  applicationUrl?: string;
  errorMessage?: string;
  kind: string;
  name: string;
  namespace: string;
}

export interface TypesSummary {
  applicationUrl: string;
  charts: TypesChartSummary[];
  instance: string;
  name: string;
  namespace: string;
  status: TypesApplicationStatus;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "/",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
          method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title ChartSentinel API
 * @version 1.0
 * @baseUrl /
 * @contact
 *
 * API simple pour lister les applications ArgoCD et suivre les versions des charts
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Retourne la liste des applications et le rapport des versions
     *
     * @tags Applications
     * @name V1AppsList
     * @summary Liste les applications
     * @request GET:/api/v1/apps
     */
    v1AppsList: (
      query?: {
        /** Name to search */
        name?: string;
        /** Number of elements to skip, default: 0 */
        offset?: number;
        /** Number of elements to return, default: 10 */
        limit?: number;
        /** Filtre les applications */
        filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<TypesListApplicationRes, any>({
        path: `/api/v1/apps`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Retourne application et le rapport de versions
     *
     * @tags Applications
     * @name V1AppsDetail
     * @summary Récupe une application
     * @request GET:/api/v1/apps/{namespace}/{name}
     */
    v1AppsDetail: (
      name: string,
      namespace: string,
      params: RequestParams = {},
    ) =>
      this.request<TypesSummary, any>({
        path: `/api/v1/apps/${namespace}/${name}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Liste les applications et applications qui ménent à cette application
     *
     * @tags Track Origin
     * @name V1AppsOriginList
     * @summary Remonte l'origine d'une application
     * @request GET:/api/v1/apps/{namespace}/{name}/origin
     */
    v1AppsOriginList: (
      name: string,
      namespace: string,
      params: RequestParams = {},
    ) =>
      this.request<TypesParent[], any>({
        path: `/api/v1/apps/${namespace}/${name}/origin`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Retourne le status de l'application
     *
     * @tags Healthcheck
     * @name V1HealthList
     * @summary Status
     * @request GET:/api/v1/health
     */
    v1HealthList: (params: RequestParams = {}) =>
      this.request<ServerCheck, any>({
        path: `/api/v1/health`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
