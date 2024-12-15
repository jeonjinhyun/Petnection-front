const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const communityService = {
  // 게시글 생성
  async createPost(formData: FormData) {
    const response = await fetch(`${API_URL}/api/v1/post`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // 게시글 조회
  async getPosts(communityRoomId: number) {
    const response = await fetch(`${API_URL}/api/v1/post/${communityRoomId}`);
    return response.json();
  },

  // 댓글 작성
  async createComment(data: {
    author: number;
    content: string;
    postId: number;
  }) {
    const response = await fetch(`${API_URL}/api/v1/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // 댓글 조회
  async getComments(postId: number) {
    const response = await fetch(`${API_URL}/api/v1/comment/${postId}`);
    return response.json();
  },
}; 