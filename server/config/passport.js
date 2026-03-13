import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import { resolveOrganizationId } from "../services/organizationService.js";

const buildUniqueUsername = async (baseName) => {
	let candidate = baseName;
	let suffix = 1;

	while (await User.exists({ username: candidate })) {
		candidate = `${baseName}_${suffix}`;
		suffix += 1;
	}

	return candidate;
};

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:5000/api/auth/google/callback",
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Find existing user
				let user = await User.findOne({ googleId: profile.id });

				if (!user) {
					const baseName = (profile.displayName || `user_${profile.id}`)
						.toLowerCase()
						.replace(/[^a-z0-9_]/g, "_")
						.slice(0, 24);
					const username = await buildUniqueUsername(
						baseName || `user_${profile.id}`,
					);

					// If no user, create one
					user = await User.create({
						googleId: profile.id,
						username,
						email: profile.emails?.[0]?.value || null,
						organization: await resolveOrganizationId(),
						profile: {
							avatar: profile.photos?.[0]?.value || "",
							joinDate: Date.now(),
						},
					});
				}

				return done(null, user);
			} catch (err) {
				return done(err, null);
			}
		},
	),
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then((user) => done(null, user))
		.catch((err) => done(err, null));
});

export default passport;
