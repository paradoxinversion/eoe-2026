The MultiAgentSelector is a modal window component that players use to assign one or more currently-unassigned empire agents to a plot or task. It shows agents based on filtering critera.

Possible filters are:

- Role

## Sections

### Agent Selection

#### Available Agents

The Available Agents section is a list of Agents that can be assigned. When an a row is clicked, the related Agent is is added to a selection array and their list entry is moved from the Available Agents side to the Selected Agents side.

#### Selected Agents

The Selected Agents section is a list of Agents that have been assigned. When an a row is clicked, the related Agent is removed from the selection array and their list entry is moved from the Selected Agents side to the Available Agents side.

### Confirmation

Beneath the Agent Selection section is a Confirmation section. This section contains two buttons.

#### Cancel

When the player clicks the Cancel button, the MultiAgentSelector modal is closed.

#### Confirm

When the player clicks the confirm button, the selected Agents are added to the Plot or Activity and the modal is closed.
