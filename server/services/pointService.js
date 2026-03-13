import PointTransaction from "../models/PointTransaction.js";
import User from "../models/User.js";

const ensurePositiveInteger = (value, name) => {
	if (!Number.isInteger(value) || value <= 0) {
		const error = new Error(`${name} must be a positive integer`);
		error.statusCode = 400;
		throw error;
	}
};

const updateLevelIfNeeded = async (user) => {
	const shouldLevelUp = user.calculateLevel();
	if (shouldLevelUp) {
		await user.save();
	}
};

export const creditPoints = async ({
	userId,
	organizationId,
	amount,
	type,
	source,
	reference,
	referenceType,
	description,
	processedBy,
	metadata,
}) => {
	ensurePositiveInteger(amount, "amount");

	const user = await User.findByIdAndUpdate(
		userId,
		{
			$inc: {
				points: amount,
				totalPointsEarned: amount,
			},
		},
		{ new: true },
	);

	if (!user) {
		const error = new Error("User not found");
		error.statusCode = 404;
		throw error;
	}

	await updateLevelIfNeeded(user);

	const transaction = await PointTransaction.create({
		user: user._id,
		organization: organizationId,
		type,
		amount,
		balance: user.points,
		source,
		reference,
		referenceType,
		description,
		processedBy,
		metadata,
	});

	return { user, transaction };
};

export const debitPoints = async ({
	userId,
	organizationId,
	amount,
	type,
	source,
	reference,
	referenceType,
	description,
	processedBy,
	metadata,
}) => {
	ensurePositiveInteger(amount, "amount");

	const user = await User.findOneAndUpdate(
		{
			_id: userId,
			points: { $gte: amount },
		},
		{
			$inc: {
				points: -amount,
			},
		},
		{ new: true },
	);

	if (!user) {
		const error = new Error("Insufficient points or user not found");
		error.statusCode = 400;
		throw error;
	}

	const transaction = await PointTransaction.create({
		user: user._id,
		organization: organizationId,
		type,
		amount,
		balance: user.points,
		source,
		reference,
		referenceType,
		description,
		processedBy,
		metadata,
	});

	return { user, transaction };
};
