import {
  CreateParams,
  CreateResult,
  DataProvider,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  fetchUtils,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams, GetOneResult, HttpError, Identifier, RaRecord, UpdateManyParams, UpdateManyResult, UpdateParams, UpdateResult
} from "react-admin";

const apiUrl = import.meta.env.VITE_JSON_SERVER_URL;

function objectToQueryString(obj: { [s: string]: unknown; } | ArrayLike<unknown>) {
  const queryString = Object.entries(obj)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as any)}`)
    .join('&');
  return queryString;
}

const options = {
  headers: new Headers({
    Accept: 'application/json',
    'x-correlation-id': '1234567890',
    'x-idempotency-id': '12345678901'
  })
};
const httpClient = fetchUtils.fetchJson;

export const dataProvider: DataProvider = {

  getList: async <RecordType extends RaRecord<Identifier> = any>(resource: string, params: GetListParams): Promise<GetListResult<RecordType>> => {
    const { page, perPage } = params.pagination;

    const filters = fetchUtils.flattenObject(params.filter);
    const queryString = objectToQueryString(filters);
    const sort = objectToQueryString(params.sort || params.meta ? { field: 'id', order: 'ASC' } : '');
    console.log('sort', sort);
    console.log('getListParams', params);

    const url = `${apiUrl}/${resource}?page=${page}&offset=${perPage}&${queryString}&${sort}`;

    console.log('url', url);

    const { headers, json } = await httpClient(url, options)
    return {
      data: json.data.response,
      total: parseInt(headers.get('x-total-count') || '0')
    }

  },

  getOne: function <RecordType extends RaRecord<Identifier> = any>(resource: string, params: GetOneParams<RecordType>): Promise<GetOneResult<RecordType>> {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return httpClient(url, options).then(({ json }) => ({
      data: json.data.response,
    }));
  },
  update: function <RecordType extends RaRecord<Identifier> = any>(resource: string, params: UpdateParams<any>): Promise<UpdateResult<RecordType>> {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json.data.response }));
  },
  create: function <RecordType extends Omit<RaRecord<Identifier>, "id"> = any, ResultRecordType extends RaRecord<Identifier> = RecordType & { id: Identifier; }>(resource: string, params: CreateParams<any>): Promise<CreateResult<ResultRecordType>> {
    const url = `${apiUrl}/${resource}`;
    return httpClient(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.data.response.id } as any,
    }));
  },
  delete: function <RecordType extends RaRecord<Identifier> = any>(resource: string, params: DeleteParams<RecordType>): Promise<DeleteResult<RecordType>> {
    const url = `${apiUrl}/${resource}/${params.id}`;
    return httpClient(url, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json }));
  },
  getMany: function <RecordType extends RaRecord<Identifier> = any>(resource: string, params: GetManyParams): Promise<GetManyResult<RecordType>> {
    console.log('getMany', resource, params);
    throw new Error("Function not implemented.");
  },
  getManyReference: function <RecordType extends RaRecord<Identifier> = any>(resource: string, params: GetManyReferenceParams): Promise<GetManyReferenceResult<RecordType>> {
    console.log('getManyReference', resource, params);
    throw new Error("Function not implemented.");
  },
  updateMany: function <RecordType extends RaRecord<Identifier> = any>(resource: string, params: UpdateManyParams<any>): Promise<UpdateManyResult<RecordType>> {
    console.log('updateMany', resource, params);
    throw new Error("Function not implemented.");
  },
  deleteMany: function <RecordType extends RaRecord<Identifier> = any>(resource: string, params: DeleteManyParams<RecordType>): Promise<DeleteManyResult<RecordType>> {
    console.log('deleteMany', resource, params);
    throw new Error("Function not implemented.");
  }
};






// const apiUrl = import.meta.env.VITE_JSON_SERVER_URL
// const httpClient = fetchUtils.fetchJson;

// export const dataProvider: DataProvider = {
//   getList: (resource, params) => {
//     const { page, perPage } = params.pagination;
//     const { field, order } = params.sort;
//     const query = {
//       sort: JSON.stringify([field, order]),
//       range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
//       filter: JSON.stringify(params.filter),
//     };
//     const url = `${apiUrl}/${resource}?${stringify(query)}`;

//     return httpClient(url).then(({ headers, json }) => ({
//       data: json,
//       total: parseInt((headers.get('content-range') || "0").split('/').pop() || '0', 10),
//     }));
//   },

//   getOne: (resource, params) =>
//     httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
//       data: json,
//     })),

//   getMany: (resource, params) => {
//     const query = {
//       filter: JSON.stringify({ id: params.ids }),
//     };
//     const url = `${apiUrl}/${resource}?${stringify(query)}`;
//     return httpClient(url).then(({ json }) => ({ data: json }));
//   },

//   getManyReference: (resource, params) => {
//     const { page, perPage } = params.pagination;
//     const { field, order } = params.sort;
//     const query = {
//       sort: JSON.stringify([field, order]),
//       range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
//       filter: JSON.stringify({
//         ...params.filter,
//         [params.target]: params.id,
//       }),
//     };
//     const url = `${apiUrl}/${resource}?${stringify(query)}`;

//     return httpClient(url).then(({ headers, json }) => ({
//       data: json,
//       total: parseInt((headers.get('content-range') || "0").split('/').pop() || '0', 10),
//     }));
//   },

//   update: (resource, params) =>
//     httpClient(`${apiUrl}/${resource}/${params.id}`, {
//       method: 'PUT',
//       body: JSON.stringify(params.data),
//     }).then(({ json }) => ({ data: json })),

//   updateMany: (resource, params) => {
//     const query = {
//       filter: JSON.stringify({ id: params.ids }),
//     };
//     return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
//       method: 'PUT',
//       body: JSON.stringify(params.data),
//     }).then(({ json }) => ({ data: json }));
//   },

//   create: (resource, params) =>
//     httpClient(`${apiUrl}/${resource}`, {
//       method: 'POST',
//       body: JSON.stringify(params.data),
//     }).then(({ json }) => ({
//       data: { ...params.data, id: json.id } as any,
//     })),

//   delete: (resource, params) =>
//     httpClient(`${apiUrl}/${resource}/${params.id}`, {
//       method: 'DELETE',
//     }).then(({ json }) => ({ data: json })),

//   deleteMany: (resource, params) => {
//     const query = {
//       filter: JSON.stringify({ id: params.ids }),
//     };
//     return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
//       method: 'DELETE',
//     }).then(({ json }) => ({ data: json }));
//   }
// };
