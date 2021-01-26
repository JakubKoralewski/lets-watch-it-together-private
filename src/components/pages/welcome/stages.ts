export enum Stages {
	AddFriends,
	AddShows,
	AddMeeting,
	Finished,
}
export const stagesDescriptions = {
	[Stages.AddFriends]: "Add friends",
	[Stages.AddShows]: "Add shows",
	[Stages.AddMeeting]: "Choose a friend to meet",
	[Stages.Finished]: "Create a meeting"
}
