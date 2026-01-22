# Profile

The Profile component is a modal window that displays information about a selected Person. This Person may be an Agent. It is invoked in the Personnel Screen (for empire Agents) and the Intelligence screen (for all other people).

## Sections

### Vital Data

The profile always shows:

- The selected person's name
- The selected person's home zone
- The selected person's sttributes
- The selected person' skills

> When the Profile subject is not an agent, the Person's first and last name is the header

When viewing an Agent in the Personnel Screen, the profile _also_ shows:

- The selected Agent's codename
- The selected Agent's role
- The selected Agent's pay
- The selected Agents status
- The selected Agent's in-game hiring date

> When the Profile subject is an agent, the Agent code name is the header

### Agent Interactions

When viewing an Agent in the Personnel screen, the Profile has the following additional sections:

#### HR Operations

The HR Operations section contains the following buttons

##### Assign Role

The Assign Role button causes the following buttons to render in a small container within the Profile

###### Administrator

Assigns the Agent to the Administrator role

###### Scientist

Assigns the Agent to the Scientist role

###### Doctor

Assigns the Agent to the Doctor role

###### Cancel

Closes the container

##### Fire Agent

Fires the Agent. This should delete the Agent object of the associated person.

##### TERMINATE Agent

Fires the agent and kills the associated person.
