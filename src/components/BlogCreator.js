const BlogCreator = ({ title, setTitle, author, setAuthor, url, setUrl }) => {
  return (
    <>
      <h2>create blog</h2>
      <p>title: <input type="text" name="Title" value={title}
        onChange={({ target }) => setTitle(target.value)}/></p>
      <p>author: <input type="text" name="Author" value={author}
        onChange={({ target }) => setAuthor(target.value)}/></p>
      <p>url: <input type="text" name="URL" value={url}
        onChange={({ target }) => setUrl(target.value)}/></p>
      <button type="submit">create</button>
    </>
  )
}

export default BlogCreator