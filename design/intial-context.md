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
