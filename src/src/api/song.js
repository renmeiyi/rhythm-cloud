import apiClient from "./index";

// 获取音乐URL
export function getSongURL(id) {
    return apiClient.get("/song/url", {
        params: { id } 
    });
}

// 获取歌曲详情
export function getSongDetail(ids) {
    return apiClient.get("/song/detail", {
        params: { ids } 
    });
}

// 获取歌词
export function getLyric(id) {
    return apiClient.get("/lyric", {
        params: { id } 
    });
}