import { Request, Response, NextFunction } from "express";
import axios, { AxiosResponse } from "axios";
import Youtube, { YoutubeVideoSearch } from "youtube.ts"

require("dotenv").config();
const { google } = require("googleapis");

interface Post {
  userId: Number;
  id: Number;
  title: String;
  body: String;
}

const getVideosSearch = async(req: Request, res: Response, next: NextFunction) => {
    const { searchQuery } = req.params

    const youtube = new Youtube(process.env.YOUTUBE_TOKEN)
    const videoSearch: YoutubeVideoSearch = await youtube.videos.search({q: searchQuery, safeSearch: 'strict', maxResults: 50})
    return res.status(200).json({
        message: videoSearch,
      });
}

const getYKList = async (req: Request, res: Response, next: NextFunction) => {
  google
    .youtube("v3")
    .search.list({
      key: process.env.YOUTUBE_TOKEN,
      part: "snippet",
      q: "cocomelon",
      maxResults: 50,
    })
    .then((response: any) => {
      //console.log(response.data)
      const { data } = response;
      console.log(data.items.length);
      let titles = data.items.map((item: any) => {
        return (({ title, description }) => ({ title, description }))(
          item.snippet
        );
      });
      return res.status(200).json({
        message: titles,
      });
    })
    .catch((err: any) => {
      console.log(err);
    });
  // get some posts
  /*let result: AxiosResponse = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
    let posts: [Post] = result.data;
    return res.status(200).json({
        message: posts
    });*/
};

// getting all posts
const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  // get some posts
  let result: AxiosResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/posts`
  );
  let posts: [Post] = result.data;
  return res.status(200).json({
    message: posts,
  });
};

// getting a single post
const getPost = async (req: Request, res: Response, next: NextFunction) => {
  // get the post id from the req
  let id: string = req.params.id;
  // get the post
  let result: AxiosResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  let post: Post = result.data;
  return res.status(200).json({
    message: post,
  });
};

// updating a post
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  // get the post id from the req.params
  let id: string = req.params.id;
  // get the data from req.body
  let title: string = req.body.title ?? null;
  let body: string = req.body.body ?? null;
  // update the post
  let response: AxiosResponse = await axios.put(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      ...(title && { title }),
      ...(body && { body }),
    }
  );
  // return response
  return res.status(200).json({
    message: response.data,
  });
};

// deleting a post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  // get the post id from req.params
  let id: string = req.params.id;
  // delete the post
  let response: AxiosResponse = await axios.delete(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
  // return response
  return res.status(200).json({
    message: "post deleted successfully",
  });
};

// adding a post
const addPost = async (req: Request, res: Response, next: NextFunction) => {
  // get the data from req.body
  let title: string = req.body.title;
  let body: string = req.body.body;
  // add the post
  let response: AxiosResponse = await axios.post(
    `https://jsonplaceholder.typicode.com/posts`,
    {
      title,
      body,
    }
  );
  // return response
  return res.status(200).json({
    message: response.data,
  });
};

export default { getVideosSearch, getYKList, getPosts, getPost, updatePost, deletePost, addPost };
