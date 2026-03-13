import Organization from "../models/Organization.js";

const DEFAULT_ORG_NAME = process.env.DEFAULT_ORG_NAME || "Gamify";

export const getOrCreateDefaultOrganization = async () => {
	let organization = await Organization.findOne({ name: DEFAULT_ORG_NAME });

	if (!organization) {
		organization = await Organization.create({
			name: DEFAULT_ORG_NAME,
			description: "Default organization for Gamify",
		});
	}

	return organization;
};

export const resolveOrganizationId = async (candidateOrgId) => {
	if (candidateOrgId) {
		return candidateOrgId;
	}

	const organization = await getOrCreateDefaultOrganization();
	return organization._id;
};
