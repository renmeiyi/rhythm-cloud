import apiClient from "./index";

// 获取歌单详情
export function getPlaylist (id) {
  return apiClient.get("/playlist/detail",{
    params: { id }
  });
}

// 相关歌单推荐
export function getRelatedPlaylist (id) {
  return apiClient.get("/related/playlist",{
    params: { id }
  });
}

