const NewPost = () => {
  return (
      <div>
        <h2>New Post</h2>
        <textarea
            placeholder="Enter your post..."
            rows={4}
            cols={50}
        />
        <br />
        <button>Send</button>
      </div>
  );
};

export default NewPost;
