# Operations Screen

The Operations Screen is where players will prepare plots and assign Agents to Actvities.

## Primary Sections

### Activities

The Activities section is where players view available, assign Agents to specific activities, and get information about what activities Agents are taking part in. It is an expandable component.

#### Activity Selector

At the top of the Activities section is a flexible set of buttons, each of which maps to a specific activity and selects it when clicked. When an Activity is clicked, the Activity Info section is rendered inside of the Activities expandable.

#### Activity Info

The Activity Info component shows information about a selected activity and allows the player to add or remove participant from said activity. It displays the following information.

##### Activity Name

The display name of the activity.

##### Cost

The total cost per day of the activity, or the activity's cost multiplied by the total amount of agents participating.

##### Participants

The participants subcomponent contains an 'Add Participants' button and a list of all current participants.

When the user clicks the Add Participants button, the [MultiAgentSelector](/design/ui/components/multi-agent-selector.md) is rendered.

Each row of the list displays:

- The name of the agent participating
- An 'Unassign' button, which removes the agent from the Activity
