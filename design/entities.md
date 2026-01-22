# Data Models

## Person

id (uuid): A unique identifer for the person

firstName (string): The person's first name

lastName (string): The person's last name

homeZoneId (uuid): The unique identifier of the zone the person lives in.

governingOrganizationSentiments ({governingOrganizationId: string}: number): A map of governing organizations (by ID) and the Person's sentiment toward them. 100 represents the best possible sentiment, while -100 represents the lowest.

intelligenceLevel (number): The level of information the Player's empire has on the person. Ranges from 1-100 and acts as a percentage of accuracy.

occupation (string): The persons job. Can be one of the following values: Administrator, Doctor, Banker, ...

attributes (PersonAttributes): The person's attributes. See PersonAttributes.

skills (PersonSkills): The person's skills. See PersonSkills.

### PersonAttributes

health (number): The amount of damage the person can take before dying. The person dies when this number is reduced to 0 or lower.

intelligence (number)

strength (number)

agility (number)

endurance (number)

empathy (number)

charisma (number)

### PersonSkills

fighting (number)

medicine (number)

business (number)

finance (number)

public Planning (number)

science (number)

## Agent

id (uuid): The unique identifier of the agent

personId (uuid): The id of the person who is the agent.

codeName (string): The agent's unique code name within their Governing Organization

affilationId (uuid): The ID of the Governing Organization the agent works for

pay (number): The agent's monthly salary

assignedProjectIds (string): The project the agent is currently assigned to.

hiredAt (string): The in-game date the agent was hired

status (AgentStatus): See AgentStatus

role (AgentRole): See AgentRole

### Agent-Related Types

AgentRole

- "Overlord": A special designation for the player's character. Can take any action any other role can.
- "Recruit": A special designation for newly hired Agents. Recruits can engage in activities that don't have restrictions, but cannot work positions in buildings.
- "Administrator": Can work in Offices and Banks.
- "Scientist": Can work in Labs.
- "Doctor": Can work in Hospitals.
- "Soldier": Can be added to Combat-related plots.

Agent Status

- "active"
- "idle"
- "unavailable"
- "dead"

## Zone

id (uuid): The unique identifier of the zone

gridX

gridY

name (string): The zone's name

size (number): The size/density of the zone.

wealth (number): Determines the types of buildings generated within the zone at world generation.

intelligenceLevel (number): The level of information the Player's empire has on the Zone, ranging from 0-100. The intelligenceLevel of a zone is an average of the intelligenceLevel of all Persons and Buildings in the zone.

governingOrganization (string): The Governing Organization that controls the Zone.

buildings (string[]): An array of ids representing the buildings within the zonw

people (string[]): An array of ids representing the people currently in the zone.

## Building

id (uuid): The building's unique identifier

name (string): The name of the building. Cosmetic, determined by building type.

type (BuildingType)

size (number): The total available 'jobs' the building has.

zoneId (uuid): The id of the zone the building is located in.

intelligenceLevel (number): The level of information the Player's empire has on the Building. Ranges from 1-100 and acts as a percentage of accuracy.

upkeepCost (number): The amount of money that needs to be paid to keep the building running at full efficiency.

infrastructureLoad (number):

### Building-Related Types

BuildingType

- "Residence"
- "Office"
- "Lab"
- "Bank"
- "Hospital"

## Science Project

projectName (ProjectName): The internal name of the science project. Short and camel-cased.

displayName (string): The user-facing name of the science project.

requirements (ProjectName[]): An array of projects required to be completed before this one can be started.

## Science Project-Related Types

ProjectName

- "centralized-communications"
- "..."

### Notes

- All science projects can only be completed once.

## Activity

name (string): The name of the activity

cost (number): The daily cost per participant engaging in the activity

participants (uuid[]): An array of ids of the agents participating in the activity

## Plot

name (string): The name of the plot

participants (uuid[]): An array of ids of the agents participating in the plot
