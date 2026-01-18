# Empire of EVIL

## Concept

Empire of EVIL is a turn-based browser strategy game. The goal for EOE players is to take over the world. Players achieve this goal by building an organization of agents to support the execution of treacherous plots, careful management of empire resources, and making the right decisions during events presented to them.

It will be developed as a web application. The prototype version will focus on a single player experience that can be expanded to multiplayer in future versions.

## **Core Mechanics of EoE (Empire of Evil)**

**Basics:**

- **Turn-based gameplay:** Players take turns making decisions and actions, followed by a resolution phase where events occur.
- **World Generation:** Procedurally generated world with Governing Organizations, Nations, Zones, Buildings, and People. Each has various attributes.
- **Work:** Different building types that populate Zones (residences, offices, labs, banks) provide resource bonuses based on the people staffing them, and require upkeep.
- **Player:** Controls an Evil Empire led by an Evil Overlord, aiming for world domination.
- **Agents:** Members of a Governing Organization.
- **Evil Agents:** People recruited and assigned to activities or plots, contributing to resource generation and plot execution.
- **Equipment:** Agents can be equipped with items that enhance their attributes.
- **Squads:** Agents can be grouped into squads, that move and act together.
- **Activities:** Evil Agents can take part in activities, such as training, creating propaganda, etc. Each activity has a cost and effect. The effect varies, depending on the Agent's related attributes.
- **Plots:** Plots are major actions taken by Governing Organizations, and range from violent action, to espionage, etc. Plots have requirements, including researching certain technologies, assigning Agents (potentially of certain attributes or positions), and having a certain level of EVIL.

**Resource Management:**

- **Four Core Resources:** Money, Science, Infrastructure, and Evil.
- **Money:** Used for building & equipment, upkeep, agent salaries, and plot execution. Gained through taxation, extortion, and resource production.
- **Science:** Determines access to plots and upgrades. Gained through research conducted by scientists in labs.
- **Infrastructure:** Determines the number of zones the empire can effectively manage. Gained through administrators working in offices.
- **Evil:** Gauge of infamy, impacting plot availability and hostility from other Nations. Increased (or decreased) by successful plots or deliberate inaction.

**Gameplay Loop:**

1. **Player Turn:** Players allocate resources, assign agents to activities, and choose plots to execute via a dashboard interface.
2. **Event Resolution:** Random events and plot execution results occur at the end of each turn.
3. **Resource Generation & Upkeep:** Resources are generated and upkeep costs are deducted.
4. **Next Turn:** The cycle repeats.

**Victory & Defeat:**

- **Victory:** Conquer every zone (or a percentage of zones) in the world.
- **Defeat:** Evil Overlord is killed or all Empire zones are captured by other organizations.
- **Alternate End-State:** All remaining zones are uninhabitable, or the world has been destroyed by the EoE or another organization.

## World & Characters

### World Entities

#### Governing Organization

Governing Organizations (GOs) are entities similar to world governments. They are the default controllers of Nations (and by extension, the Nation's zones and resources).

##### Basic Attributes

- **Name:** Unique name for the GO
- **Money:** The GO’s amount of cash. This is spent on building upkeep, agent salaries, plots, and science projects.
- **Science:** The GO’s total science resource balance. This is spent on science projects.
- **Infrastructure**: The GO’s total infrastructure resource balance. This is a gauge representing how much of Org’s infrastructure it can support (ie, how much of the resources those buildings produce that it can exploit).
- **EVIL**: The GO's total infamy. Higher EVIL grants is required to execute certain plots or actions.
- **Captives**: A list of people the GO has taken captive. These people can take a limited set of specified actions.
- **Effects**: Current status effects applicable to this GO.

#### Nation

Nations represent areas that are made up of Zones. Nations are controlled by GO's.

##### Basic Attributes

- **Name:** The name of the nation
- **Size:** The amount of Zones in this Nation at world generation time.

#### Zone

Zones represent regions of their respective nations within the world.

##### Basic Attributes

- **Name:** Unique name for the zone
- **Size:** Influences how many people are generated in the zone at world gen .
- **Nation:** The nation the zone resides within.
- **Governing Organization:** The GO that controls the zone.
- **Wealth**: Influences the types of buildings generated for the zone. Wealtheir zones generate more Labs, Hospitals, and Offices. Less wealthy zones have more Residences.
- **Intel Level**: The level of knowledge/surveillance the Empire has on the zone, providing more accurate estimations of citizens (and their sentiments), Agent counts, Zone/Building resources, etc.
- **Effects**: Current status effects applicable to this zone.

#### Building

Buildings provide resources to their respective GO’s when staffed with skilled People (personnel).

##### Basic Attributes

- **Name**: Unique name for the building
- **Type**: The building’s type
    - **Residence**: Houses zone citizens & agents
    - **Office**: Allows Administrators to work, and grants infrastructure bonuses
    - **Lab**: Allows Scientists to work, and adds science points each turn work happens
    - **Bank**: Provides money to the owning GO each turn
    - **Hospital**: Allows Doctors to work, and Agents & citizens to heal. Agents of the Empire can only heal in hospitals owned by the Empire.
- **Size**: Determines how many occupants or workers the building can have
- **Zone**: The zone the building is in
- **Governing Organization**: The GO that owns the building
- **Resource**: The type and value of the resource the building provides.
- **Intel Level**: The level of intel the Empire has on the building (ie, occupants/workers, resource output, upkeep costs, etc)
- **Effects**: Current status effects applicable to this building.
- **Upkeep Cost**: The amount of money per day it costs for the building to operate at full capacity.
- **Infrastructure Load**: The required Infrastructure points required to be available for the building to operate at full capacity.

#### Person

Represents a citizen or agent within the game. People have Primary and Secondary attributes.

##### Primary Attributes

- **Name**: Randomly generated name for the person. Does not have to be unique.
- **Home Zone**: The zone the person lives in.
- **GO Sentiments**: A set of numeral scales (-100 to 100) that represent how positively or negatively the person views a given GO. This attribute is considered 'Loyalty' when it applies to the GO of the Nation they belong to, unless they are an Agent of another nation.
- **Combat**: The person’s combat prowess.
- **Leadership**: How many people the person can lead or command
- **Administration**: The person's ability to manage parts of the empire. Factors into infrastructure bonuses they provide.
- **Health**: How much damage the person can take before dying.
- **Intelligence**: How intelligent the character is, granting resource bonuses when they work in a building.
- **Empathy**: How empathetic the person is to other people. Causes loyalty reduction when actions breach their level of empathy.
- **Effects**: Current status effects applicable to this person.
- **Intel Level**: The level of information known about the citizen by the Empire

##### Secondary Attributes

Secondary attributes factor into Primary Attributes

- **Strength**: Factors into Combat and increases damage dealt in combat.
- **Constitution**: Factor's into Health.
- **Agility**: Factors into Combat, and increases the possibility of a character avoiding damage in combat.
- **Endurance**: Factors into Combat and reduces damage taken in combat.
- **Analytical Thinking**: Factors into Administration and increases the Infrastructure bonuses of the Offices they work in.
- **Scientific Thinking**: Factors into Intelligence and increases the Science bonuses they provide when working in a Lab.
- **Charisma**: Factors into Leadership.

#### Agent

Agents are People employed by a Governing Org.

##### Attributes

- **Person:** The person that is the agent
- **Agent Type**:
    - Recruit (new agents are Recruits until assigned to a specific type)
    - Administrator
    - Scientist
    - Doctor
    - Troop
- **Salary**: The agent's monthly salary

## World Gen

### Basic World Generation

1. **CPU Organizations:** CPU-controlled Governing Organizations are created, establishing the player's rivals.
2. **Nation Formation:** Each CPU Organization is assigned a Nation, defining the political landscape of the game world.
3. **Zone Establishment:** Nations are divided into Zones (according to their Size attribute), representing the geographical territories players will compete over.
4. **Population Creation:** Zones are populated with people, each having unique attributes (loyalty, command, strength, etc.). GO leaders are generated at this time.
5. **Building Infrastructure:** Zones are populated with buildings.

### Evil Empire Genesis

1. **Player Overlord:** The player creates their evil overlord character.
2. **Zone Conquest:** The player is granted control of a randomly chosen zone, marking the beginning of the Evil Empire.
3. **Citizens Turned Minions:** People in the conquered zone become loyal to the Evil Empire, and a portion of them become Evil Agents.

## Resource Management

Managing resources is a central activity in the game.

### Resources

- **Money:** Used for upkeep, agent salaries, and plot execution. Gained through various means including plots, activities, and money provided by Buildings such as Banks.
- **Science:** Determines access to plots and upgrades. Gained through research conducted by scientists in labs.
- **Infrastructure:** Determines the number of zones the empire can effectively manage. Gained through administrators working in offices.
- **Evil:** Gauge of infamy, impacting plot availability and hostility from other Nations. Increased by successful plots.

#### Economy

EOE should implement a basic economy system. Buildings have upkeep costs and working Citizens/Agents have salaries that are paid.

Each Organization gains money from the businesses in their owned zones. Businesses (such as Offices and Banks) contribute a certain amount of money each day to their organization.

## Events

At the end of the player’s turn, at least one event will occur. Events must be resolved before the player can proceed with the game. Events may have an effect that automatically occurs. Events may also include actions the player can take during event resolution. Events that have no tangible effect on the world can be skipped.

### Event List

#### Uneventful Day

Skippable: Yes

Nothing of any importance happens.

**Requirements**

- None

**Immediate Effects**

- None

**Player Options**

- None

#### Citizen Recruited

Skippable: No

A citizen in a zone the empire controls is suggested for recruitment. Their stats are shown on screen, and the player decides how to respond.

**Immediate Effects**

Nothing

**Player Options**

- Recruit the Citizen: The player selects an Agent to command the new citizen, and the citizen becomes an Agent of the empire.
- Ignore: Nothing happens

#### Angry Admin

Skippable: No

The player’s most effective Administrator has decided to quit, in spectacular fashion.

**Requirements**

- One administrator working in an Office

**Immediate Effects**

- The empire Agent with the highest Administration is no longer an agent, and no longer loyal to the empire.
- There is a possibility the former agent will remain for event resolution.
    - If they remain, the player gains an option for resolution
    - If they leave, they may deal damage in that zone

**Player Options**

- Terminate Them: Kill the former agent. This is only possible if the agent remains for resolution.
- Do Nothing: Nothing happens

#### Attempted Espionage

Skippable: No

Authorities apprehended a foreign operative engaged in espionage activities within the empire's borders.

**Requirements**

- Foreign org with opinion of EoE less than 25

**Imemediate Effects**

- A foreign agent is captured

**Player Options**

- Kill them
- Keep them captive
- Let them go

#### Raid

Skippable: No

They think they can steal from the Empire. They are wrong.

**Requirements**

- None

**Immediate Effects**

- A combat encounter begins with a random selection of people with a low sentiment for the Empire

#### A can of soup… Or Something

Skippable: No

An agent was struck by an object thrown by a citizen.

**Requirements**

- One citizen with low loyalty to the Empire

**Immediate Effects**

- An agent loses some health

### Scientific Breakthrough

Skippable: Yes  
Our research team has achieved a monumental milestone.

**Requirements**

- At least one lab is staffed

**Immediate Effects**

- Increases empire science

#### Gone too far

Skippable: No

Regrettably, one of your Agents has exceeded their authority and engaged in the tragic act of taking innocent lives.

**Requirements**

- An agent with low empathy

**Immediate Effects**

- A civilian is killed
- People may retaliate, starting a combat encounter
- Some people in the zone may become drastically more or less loyal

**Player Options**

- Physical Punishment
    - Agent loses moderate HP, may reduce loyalty to EoE
    - People are satisfied; loyalty increases a little for everyone in the zone
    - Loyalty may decrease a little bit for the agent
- Terminate Agent
    - Agent is killed
    - Loyalty increases by a larger amount for everyone in the zone
    - Loyalty increases by a small amount for all agents
- Fire agent
    - Agent is fired from EoE.
    - Loyalty increases a little for everyone in the zone.
    - Loyalty decreases sharply for fired agent.
- Give bonus
    - The agent is paid some money from the empire till
    - The agent's loyalty is raised by a medium/high amount
    - Empire gains a small amount of EVIL.

#### Immigration

Skippable: No  
A citizen of another nation has fled to the empire.

**Requirements**

- None

**Immediate Effects**

- A citizen from a foreign nation is added to a random zone in the EoE.

#### Sickness

A zone has experienced the emergence of a disease

**Requirements**

- Zone population greater than 50

**Immediate Effects**

- Adds ‘outbreak’ effect to the Zone

#### The People's Revolution

The people of the empire have risen up in revolt against the oppressive rule of the Evil Empire\! Citizens in all zones are protesting, rioting, and even taking up arms against the empire's agents.

**Immediate Effects:**

- All citizens in all zones in the empire suffer a decrease in loyalty.
- The empire's income is reduced by 50%.
- The empire's infrastructure is damaged, reducing the number of zones it can effectively manage.

**Player Options:**

- **Suppress the Revolution:** The player can send agents to quell the riots and restore order. This will be a difficult task, as the people are highly motivated to overthrow the empire.
- **Negotiate with the Rebels:** The player can attempt to negotiate a peace settlement with the rebels. This may be possible if the player is willing to make concessions, such as releasing political prisoners or reducing taxes.
- **Ignore the Revolution:** The player can choose to ignore the revolution and hope that it will eventually die down on its own. However, this is a risky strategy, as the revolution could spread and eventually overthrow the empire.

#### The Great Fire

A devastating fire has broken out in one of the empire's major cities, destroying buildings and infrastructure and killing many citizens.

**Immediate Effects:**

- The zone where the fire occurs suffers a decrease in loyalty and infrastructure.
- The empire's income is reduced.
- The player is given the option to send agents to help put out the fire and rescue citizens.

**Player Options:**

- Send agents to help put out the fire and rescue citizens.
- Do nothing.

## Activities

Activities are daily tasks that Agents can be assigned to. Assigning Agents to activities can have various benefits and consequences. Agents assigned to activities are occupied with said activity until they are unassigned, killed, captured, or otherwise incapacitated.

Activities have the following properties:

- **Cost**: A variable amount of money required per-participant/day to engage in the activity
- **Requirements**: The required amount of EVIL, Infrastructure, or Science Points to start the activity. Some activities require certain technologies to be researched, or Zones to have certain effects.
- **Effects**: The outcome of specific activities. Activities can have multiple effects.

### Activities List

#### Training

- Requirements:
    - None
- Effects
    - Chance to raise a secondary attribute

### EVIL Oratory

- Requirements:
    - None
- Effects
    - Gain a small amount of money
    - Chance to increase loyalty of a small number of Citizens in participant’s zones
    - Increase EVIL by a small amount

### EVIL Education

- Requirements:
    - None
- Effects
    - Increase the loyalty of participants, up to the max.

### Harass Nuns

- Requirements:
    - None
- Effects
    - Raises EVIL
    - Has a chance of reducing loyalty in non-Agent citizens by a small amount.
    - Has a chance of a small number of Citizens becoming disloyal and hostile (triggering combat) in participant’s zones

### Survey Citizens

- Requirements:
    - Centralized Communications Researched
- Effects
    - Increase the Intelligence Level on one citizen per participant, in participant’s zones

### Smuggle Resources

- Requirements:
    - None
- Effects
    - Chance to gain money.
    - Increases EVIL by a a small amount
    - Participants have a chance to be captured by foreign agents

Intimidation Campaign

- Requirements:
    - None
- Effects
    - Decrease loyalty in rival zones.
    - Increase EVIL.

## Plots

Plots have the following properties

- **Min Agents**: The minimum amount of individual agents required to execute the plot.
- **Min Agents**: The maximum amount of individual agents allowed to execute the plot.
- **Min Squad**: The minimum amount of Squads required to execute the plot.
- **Max Squads**: The maximum amount of Squads allowed to execute the plot.
- **Target Zones**: The Zone(s) the plot targets.
- **Cost**: The amount of money it costs to start the plot.

### Economic Disruption

#### The Biggest Tax for the Oldest Profession

Enforce high taxes on people in ‘adult services’.  
Requirements

- Agents
    - Participants: 1+
- Zones
    - Target Zones: 1+
- Cost:
    - 1$/zone

Results

- Any result
    - Chance to increase EVIL by a small amount
    - Chance to reduce loyalty in a small amount of citizens by a small amount
- Success
    - Increase EVIL by a small amount
    - Increase wealth bonuses in zones

### Political Manipulation

Send Ade  
Send them some ade. Cool-ade. Tons and tons of Cool-ade.

Success

### Military Operations

#### Takeover Zone

Attempt to take over a foreign zone. This triggers a Combat Encounter event with the foreign agents of that zone. The plot succeeds if empire forces win the combat encounter.  
Requirements

- Agents
    - Participants: 1+
- Zones
    - Target Zones: 1

Results

- Any result: Chance to increase EVIL by a small amount
- Success
    - The zone and its buildings are controlled by the empire
    - Zone Intelligence Level is raised to the max
    - EVIL increases by a medium amount
- Failure
    - Participating agents are moved to the morgue (as they would be dead from combat failure)

### Espionage & Information Gathering

#### Reconnaissance

Gather information on a foreign zone  
Requirements

- Agents
    - Participants: 1+
- Zones
    - Target Zones: 1

Results

- Any result: Chance to increase EVIL by a small amount
- Success
    - Increase EVIL by a small amount
    - Decrease margin of error on reports regarding the zone, the zone’s nation, and GO
- Failure
    - The participating agents will either…
        - Be Captured
        - Enter Combat with foreign zone agents
        - Escape

centralized telecommunications  
Success

- Add ‘centralized-telecommunications’ effect

Encryption  
Add encryption-protocols to eoe

### Social Engineering & Propaganda

Spread Conspiracy Theories  
Spread conspiracy theories among a tsgrt zone to lower citizen's intelligence and/or increase loyalty to the empire.  
Results  
Success  
A small number of citizens are effectes by conspiracy theories

#### Organize Antiwork Unions

Plant EVIL Agents in a foreign zone to convince their citizens that work is bad.  
Requirements

- Agents
    - Participants: 1+
- Zones
    - Target Zones: 1

Results

- Success
    - A small number of building personnel in the target zone quit.
- Failure
    - A small number of building personnel in the target zone have increased loyalty to their Governing Org

#### Free Internet

Give citizens free internet for loyalty bonuses  
Requirements

- Agents:
    - Participants: 1 Scientist
- EVIL: 25
- Science: 10
- Infrastructure: 1/controlled zone

Science projects

Centralized Telecommunications  
Cost: $10  
Science: 10  
Completion: 5  
Research tapping into people's phones  
Succes

- Adds the Centralized Telocommunications plot

Encryption Protocols  
Cost:  
Science:  
Completion:  
Success

- Adds Encryption plot

Hyper-refractive materials  
Add ‘hyperrefractive-materials’ to eoe

Advanced Forgeries

Propaganda Department

Cyberwarfare Defense

Enhanced Border Enforcement

# ScienceProjects

Centralized Communications  
Research centralizing communications to increase surveillance and control.

Miniaturized Locomotion  
Enables

- Research
    - Micro Flight Control

Micro Flight Control  
Micro flight control enables drones.

Requires

- Research
    - Micro Flight Control

Empire Intranet

Requires

- Research
    - Centralized Communications

Enables

- Activity

Adds Status

# Effects

## Governing Organization Effects

No Prisoners  
no-prisoners  
The org takes no prisoners  
Encryption Protocols  
encryption-protocols  
The org uses bleeding edge encryption. Extra hard to crack. Extra bad if the org loses the password.  
Effect

‘centralized-telecom’  
The org taps the phones of its citizens

Hyperrefractive Materials  
Enables plots: Hypno Disco Ball

Counterfeiter  
Enables Plot: Funny Money Printing Press

missile pigeons  
The empire can utilize pigeon guided missiles

Pigeon missiles  
The empire can utilize missile guided pigeons

## People

Conspiracy Theories (People)  
Resist: Intelligence  
Conspiracy theories make people more paranoid of one GO and potentially more loyal to another. The effects of conspiracy theories apply only while the person has the effect. The effect remains until the person successfully resists the effect with an intelligence check. Every day, there is a small chance one other person in the zone will gain the effect for each person with an active conspiracy theories effect.  
Zones

Outbreak  
A disease appears in the zone. It may infect people in the affected zone. The effect may spread to other zones.

# Gameplay

### Starting the game

A player starts the game by selecting a name for their EVIL Overlord.  
The Sidebar  
There is a sidebar present on the screen allowing players to navigate to different UI screens.

#### Buttons

- Intel: Open the Intel screen
- Empire: Open the Empire Screen
- Personnel: Open the Personnel Screen
- Science: Open the Science Screen
- Plots: Open the Plots Screen
- Activities: Open the Activities Screen
- Next Day: End the current turn

## The Interface

### The Main Screen

After creating their Overlord, Players are taken to the Main Screen. This screen shows basic information about the EVIL Empire and options the user can take. It shows a detailed profile of the player’s EVIL Empire, including some roster metadata, cash flow, zones, science, and infrastructure.

#### Widgets

- Resources: A basic at-a-glance display of EVIL, Money, Science, and Infrastructure
- Operations: A list of queued plots and activities with participants

### The Intel Screen

The Intel Screen shows information about foreign zones, to help players make informed decisions about plots/strategy. It includes information about enemy agents and zone citizens.

#### Widgets

Zone Intel: Shows intelligence abo

### The Personnel Screen

The Personnel Screen shows a roster of the EVIL Empire’s agents, and allows the player to modify the structure.

#### Widgets

- Employee Roster
- Agent Profile: Allows the player to view agent stats and take the following actions
- Terminate (kill) agent
- Kill agent
- Transfer Agent Department: Change the Agent’s department
- Move agent: Change the Agent’s home zone to one in the player’s control

### The Economy Screen

The economy screen shows a breakdown of the empire’s income and expenses.

#### Widgets

- Expenses
    - Building Expenses
    - Plot Expenses
    - Salaries
    - Activity Expenses
- Income
    - Building Income
    - Citizen Taxes
    - Activity Income

## Event Screens

As the game progresses, Event Screens allow players to respond to happenings in the game. Their content is dependent upon the actual event they represent.

### Event Screen Types

#### Combat Report

Shows the results of a combat encounter. Includes information about: which side won, who died, what happened during the encounter (ie, combat log).

#### Reconnaissance Report

Shows information about a zone, including: number of agents, defenses. This screen is shown upon successful completion of Reconnaissance missions.

#### Agent Recruited

Shows information about an agent recruited to the empire

#### Zone Lost

Shows information about a zone that is no longer under player control

#### Zone Gained

Shows information about a zone that is now under player control

Simulation  
At the end of every turn, there is a simulation phase. During this phase, all citizens in all zones take three actions. These actions include going to work, protesting, binging on conspiracy theories and more. Some actions require the person to meet certain requirements, such as having an attribute above/below/at a certain number, being personnel at a building, having a certain status effect, etc.

People’s attributes may change during the course of the actions they take during simulation— for instance their attribute points or status effects may fluctuate. Some actions they take may trigger events.

Simulated Actions  
Protest  
Go to Work  
Binge on conspiracies  
Laze at home  
Go to the bar  
Go for a walk  
Create art  
Go tagging  
Pick fight  
Set a \_\_\_ on fire  
Go shopping  
Stare at the wall and cry  
Start a project  
Finish a project  
Got sick  
Spent time with a friend

Death  
When people have zero health, they are dead. They can not participate in plots or activities, and their dead attribute is set to true.

The Morgue(s)  
Dead people are considered to be ‘in the morgue’. Which morgue depends on whether or not the person is an Agent. Citizens are considered in their zone’s morgue (represented by the zone’s id). Agents are considered part of their Governing Organization’s morgue. Taking an action involving corpses in a Governing Organization’s morgue generates less outrage (ie, loss of loyalty) amongst citizen’s in the corpse’s zone. In the case of agent Termination, the former agent’s morgue is the citizen (zone) morgue, because they were stripped of agent status before death.

Capture  
People taken captive by a Governing Organization are added to the GO’s list of captives. Captives may be released, held, or killed.

# The CPU

During the course of the game, the cpu should take actions and respond to the player's. The cpu has a limited set of actions:

- Send its own agents into another organization's territory
    - These entries will usually be in the form of attacks or espionage
- Attempt to take over a zone
    - Should be determined by some trait
    - Orgs should first try to regain lost territory, but don't always need to
- Abduct a person from another zone
- Take over a building in a zone?
- Act against the evil empire
    - Basically, any of the above, with increasing hostility as the empire gains evil
- Staff development
    - Increase agent skills and attributes
- Research
    - The cpu should research projects and utilize the benefits if they have the resources

At the end of each turn, during the advance day phase, each cpu organization takes one action. If the action affects the empire, an game event is added to the queue.

The cpu is bound by most of the same basic rules as the player. It gets the same penalties for lack of infrastructure workers, failing to pay its agents, etc.

If it is possible for orgs to take multiple actions (ie, queue an attack, start research, etc), such actions should be limited appropriately.

Resistances, Heroes, and the World Police  
As the game progresses and players accumulate enough EVIL, new organizations will be generated to represent organized resistance movements, teams of (potentially super) heroes, and a globalized police force, intent on ending the Empire’s reign.

The orgs of resistances/heroes/WP are just ‘new’ cpu players, and behave in the same way, with some exceptions:

- Hero orgs
    - Cannot abduct people
    - Cannot take over zones
    - Cannot research new technology (they should be generated with all of their status effects)
    - Only focuses on the empires
    - Spend most of their time on development
- World Police
    - Cannot take over zones
    - Only focuses on the empire
    - Cannot research new technology. Occasionally gains a random researched technology (status effect) from a non-empire org that is still in play.
- Resistances
    - Can only take over zones in their native nation.
    - Cannot act outside of their Nation. (ie, no recon or similar operations)

Actions taken by the cpu should be logged, and major events (such as the taking over of a zone, if not the empire's) should be noted/shown somewhere in the ui.

Ending the Game  
Victory  
The player is victorious when they have control of every zone in the world. If zones are rendered uninhabitable or uncapturable, they are ignored in this count.

Defeat  
The player is defeated when their overlord is killed or the evil empire controls zero zones, including cases where the empire renders all of its own zones uninhabitable.
