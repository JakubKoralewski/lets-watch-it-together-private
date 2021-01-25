export enum Stages {
	AddFriends,
	AddShows,
	AddMeeting,
	Finished,
}
export const stagesDescriptions = {
	[Stages.AddFriends]: "Add friends",
	[Stages.AddShows]: "Add shows",
	[Stages.AddMeeting]: "Create a meeting invite",
	[Stages.Finished]: "You have finished"
}