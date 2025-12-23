import apiClient from "./index";

//获取歌单分类
export function getHotPlayList() {
  return apiClient.get("/playlist/hot");
}

//获取精选歌单
export function getTop(){
  return apiClient.get("/top/playlist",{
    limit:20
  });
}

//获取精品歌单
export function getHighquality(){
    return apiClient.get("/top/playlist/highquality",{
        limit:20
    });
} 

//获取歌手列表
export function getArtistList () {
  return apiClient.get("/artist/list",{
    params: {
      cat: 1001,
      limit: 20
    }
  })
}