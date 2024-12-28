import User from "../models/user.model.js";

export const getUserProfileAndRepos = async (req, res) => {
	const { username } = req.params;
	try {
		
		const userRes = await fetch(`https://api.github.com/users/${username}`, {
			headers: {
				
			},
		});

		const userProfile = await userRes.json();

		const repoRes = await fetch(userProfile.repos_url, {
			headers: {
				
			},
		});
		const repos = await repoRes.json();

		res.status(200).json({ userProfile, repos });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const likeProfile = async (req, res) => {
	try {
		const { username } = req.params;
		const user = await User.findById(req.user._id.toString());
		console.log(user, "auth user");
		const userToLike = await User.findOne({ username });

		if (!userToLike) {
			return res.status(404).json({ error: "User is not a member" });
		}

		if (user.likedProfiles.includes(userToLike.username)) {
			return res.status(400).json({ error: "User already liked" });
		}

		userToLike.likedBy.push({ username: user.username, avatarUrl: user.avatarUrl, likedDate: Date.now() });
		user.likedProfiles.push(userToLike.username);

		// await userToLike.save();
		// await user.save();
		await Promise.all([userToLike.save(), user.save()]);

		res.status(200).json({ message: "User liked" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getLikes = async (req, res) => {
	try {
	  // Extract the userId from the request parameters
	  const { userId } = req.params;
  
	  // Find the user by the provided userId
	  const user = await User.findById(userId).select('username likedBy');
  
	  // Check if the user exists
	  if (!user) {
		return res.status(404).json({ error: 'User not found' });
	  }
  
	  // Send response with the user's likes
	  res.status(200).json({
		_id: user._id,
		username: user.username,
		likedBy: user.likedBy, // Returning the list of users who liked this user
	  });
	} catch (error) {
	  res.status(500).json({ error: error.message });
	}
  };