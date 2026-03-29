# Learning Velocity and Constraint Strategy Dashboard
https://kart-dashboard-neon.vercel.app/

## Purpose

This dashboard is a compact performance analysis tool created to track improvement in karting practice over time. Instead of treating performance only as a question of “what was the fastest lap?”, it tries to measure development under constraints: how quickly a driver improves, how consistently the performance can be reproduced, and how effectively feedback is converted into measurable change.

I built it around one central question: how should I analyse progress if the most important element of the story is not that I started as the fastest driver, but that I improved quickly through iteration, adaptation and feedback? In this sense, the project is less a display of results than an attempt to model a learning process.

The dashboard is intentionally structured as a decision tool, not as a highlight reel. It combines contextual information about the starting conditions with session-level lap data and a small number of feedback loops showing how specific coaching inputs led to concrete interventions and then to observable changes in performance.

## What the dashboard shows

The first section, *Constraints & Context*, establishes the frame of the performance story. It includes the category, physical profile, baseline experience and notes on track conditions and setup. This is important because the aim is not to present performance in a vacuum, but to show how progress was made under real constraints. More particularly, it shifts the focus away from excuse-making and towards adaptation: if the starting conditions are more demanding, what matters is how effectively the driver is able to respond.

The second section, *Learning Velocity*, uses session-level data to follow median lap time, best lap time, and variation in lap times across a sequence of sessions. The principle idea here is that progress should be read not only in terms of absolute pace, but also in terms of learning rate and repeatability. A reduction in lap time matters, but a reduction in variation matters also. Taken together, these suggest not only faster performance, but more controlled performance as well.

The third section, *Coachability Loop*, is the part of the dashboard that most clearly transforms data into a model of learning. Instead of simply presenting outputs, it records a sequence: observed issue, intervention, and result. For example, a problem with overly aggressive entry into a corner can lead to a braking adjustment, which can then be followed through changes in lap-time variation or stability across the next sessions. This section is important because it makes visible a pattern that is often described informally, but not measured in a careful way: the capacity to absorb feedback and improve as a consequence.

The final section, *Data Notes*, makes clear that this is an initial version of a larger possible analysis. Its role is partly practical, but also methodological. A project of this kind becomes more credible when it distinguishes clearly between what is already measured, what is estimated, and what remains to be developed further.

## Main insight

The most important point supported by the dashboard at this stage is that improvement should not be understood only as a matter of isolated fast laps. A more meaningful measure is the combination of pace, consistency and responsiveness to feedback over time.

Even in its present form, the dashboard suggests that performance development can be analysed as a system. Constraints are identified, session data is tracked, interventions are introduced and outcomes are reviewed. This is what makes the project interesting to me not only as a sports analysis exercise, but also as a wider exercise in applied reasoning: how to define useful metrics, how to avoid reading too much into noisy data and how to transform a vague sense of progress into something more testable.

## Current limitations

At this stage, the dashboard should be read as a working model rather than as a finished analytical system. Some metrics are stronger than others, and not every session is perfectly comparable. Track conditions, tyre age, session type and other contextual factors introduce noise into the dataset. In addition, some fields are currently simplified for clarity in a public-facing version.

That being said, I think that these limitations are part of the value of the project rather than a reason to dismiss it. One of the central difficulties in any real-world analysis is that the data is rarely clean. The real question is whether the framework is sufficiently good to organise imperfect evidence into a more useful picture. My objective here has been to build such a framework.

## Next steps

The next stage would be to develop the dashboard further in three directions.

- First, I would improve the underlying dataset by adding stronger session tagging, especially for conditions such as wet versus dry running, tyre state, and -practice versus race context. This would allow the comparisons to become more precise.

- Second, I would refine some of the current metrics, especially those related to stability and risk-adjusted performance. For example, it would be useful to distinguish more clearly between simple pace gains and improvements in controlled pace under pressure.

- Third, I would expand the feedback-loop model by linking more coaching inputs to session evidence, video review, or corner-specific notes. This would strengthen the connection between technical diagnosis and performance outcome.

Overall, the next step is not simply to make the dashboard larger, but to make it more discriminating. The aim is to move from a good descriptive model of improvement towards a more rigorous evaluative one
