const request = require("supertest")
const { expect } = require("chai")
const express = require("express")
const mongoose = require("mongoose")
const Post = require("../models/Post")

describe("test de recuperation des posts..", () => {
  let app

  before(async () => {
    const uri = "mongodb://localhost:27017/blogify"
    await mongoose.connect(uri)

    app = express()

    app.get("/posts", async (req, res) => {
      const posts = await Post.find()

      if (posts) {
        res.send("coucou")
      } else {
        res.send("aie")
      }
      
    })
  })

  after(async () => {
    console.log("test terminé..")
  })

  it("should return un petit coucou", async () => {
    const response = await request(app).get("/posts")

    expect(response.text).to.equal("coucou")
  })
})
