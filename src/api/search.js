import apiClient from "./index";

// 搜索
export function getSearch(keywords, type = 1, limit = 30, offset = 0) {
  return apiClient.get("/search", {
    params: { keywords, type, limit, offset }
  });
}

// 默认搜索关键词
export function getSearchDefault() {
  return apiClient.get("/search/default");
}

// 搜索建议
export function getSearchSuggest(keywords) {
  return apiClient.get("/search/suggest", {
        params: { keywords } 
    });
}

// 热搜列表
export function getSearchHot() {
  return apiClient.get("/search/hot");
}

// 热搜列表（详细）
export function getSearchHotDetail() {
  return apiClient.get("/search/hot/detail");
}

// 搜索多重匹配
export function getSearchMultimatch(keywords) {
  return apiClient.get("/search/multimatch", {
        params: { keywords } 
    });
}