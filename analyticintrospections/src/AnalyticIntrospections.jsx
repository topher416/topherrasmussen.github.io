import React, { useState, useEffect } from 'react';

const AnalyticIntrospections = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          setActiveSection(section.id || '');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100">
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-20">
        <header className="mb-20 text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Analytic Introspections from an Actor's Perspective
          </h1>
          <p className="text-xl text-gray-400 mb-2">by Topher Rasmussen</p>
          <p className="text-sm text-gray-500">MFA Theatre Arts, University of Utah | Spring 2020</p>
        </header>

        <nav className="mb-16 p-6 bg-slate-900/50 backdrop-blur rounded-lg">
          <h2 className="text-2xl font-serif mb-4 text-gray-300">Table of Contents</h2>
          <ol className="space-y-2 text-gray-400">
            <li><a href="#intro" className="hover:text-blue-400 transition-colors">Introduction</a></li>
            <li><a href="#preface" className="hover:text-blue-400 transition-colors">Preface</a></li>
            <li><a href="#section1" className="hover:text-blue-400 transition-colors">1: The Audition</a></li>
            <li><a href="#section2" className="hover:text-blue-400 transition-colors">2: Anticipation</a></li>
            <li><a href="#section3" className="hover:text-blue-400 transition-colors">3: Another Actor Prepares</a></li>
            <li><a href="#section4" className="hover:text-blue-400 transition-colors">4: The Callbacks</a></li>
            <li><a href="#section5" className="hover:text-blue-400 transition-colors">5: Choosing the Role</a></li>
            <li><a href="#section6" className="hover:text-blue-400 transition-colors">6: Rehearsal Begins</a></li>
            <li><a href="#section7" className="hover:text-blue-400 transition-colors">7: Collapse</a></li>
            <li><a href="#conclusion" className="hover:text-blue-400 transition-colors">Conclusion</a></li>
          </ol>
        </nav>

        <section id="intro" className="mb-40">
          <h2 className="text-4xl font-serif mb-12 text-gray-300">Introduction</h2>
          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-gray-300">I started the MFA in Theatre Arts at the University of Utah in August 2017, and I wanted the degree because of the way actors can change.</p>
            
            <p className="text-gray-400">The MFA is three years long, full-time student loans, books and homework and exams, plays and showcases, and I wanted to finish it being someone different from who I was when I began it. I wanted to have skills I didn't have. I wanted to know things that I didn't know before.</p>

            <div className="bg-slate-900/50 p-6 rounded my-8">
              <p className="text-gray-300 italic">"The student actor who strives earnestly and consistently, and is willing to accept guidance from a competent teacher, opens himself to a radical transformation. At the end of his training he is a different person from what he was at the start, not only as an actor, but as a human being."</p>
              <p className="text-xs text-gray-500 mt-2">— Michael Chekhov</p>
            </div>

            <p className="text-gray-400">Michael Chekhov is talking about a kind of change that is difficult to measure, and yet the actor can feel it, and so can other actors. The actor's work, like therapy, includes the risk of destabilizing one's sense of self, which can be disorienting and anxiety-inducing, and it also includes the possibility of becoming more integrated and whole.</p>

            <p className="text-gray-300 text-xl italic mt-8">I wanted to observe what it was like to go through this transformational process, and I wanted to write about it.</p>

            <p className="text-gray-400">I thought about this writing endeavor as a kind of psychology project because it involved self-observation, memory, note-taking, and subjective analysis. Pursuing this writing required me to practice metacognition, to watch myself thinking, to observe my observations.</p>

            <p className="text-gray-500 italic">I wondered if I could articulate what it feels like to work as an actor?</p>
          </div>
        </section>

        <section id="preface" className="mb-40">
          <h2 className="text-4xl font-serif mb-12 text-gray-300">Preface</h2>
          
          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-gray-300">A few months ago, I auditioned for a play at Salt Lake Acting Company. During the audition, I experienced something that was difficult to describe. I felt vulnerable and open and terrified in a good way. I felt my nervous system reacting and I started sweating. I felt incredibly present.</p>

            <p className="text-gray-400">I wanted to capture that experience as it was happening, as if I were a psychologist observing his own reactions to an event. I wanted to write about the experience of auditioning, of waiting for a callback, of preparing for a role, of being in rehearsal.</p>

            <p className="text-gray-300 text-xl italic">This project became an exploration of the psychology of acting through introspective journaling.</p>

            <div className="bg-blue-950/20 p-8 rounded my-12">
              <p className="text-gray-300 mb-4">The play I auditioned for was <span className="italic">How to Transcend a Happy Marriage</span> by Sarah Ruhl.</p>
              <p className="text-gray-400">Sarah Ruhl is one of my favorite playwrights. Her work is poetic, funny, and deeply human. I had studied her plays in graduate school and was excited about the possibility of being in one of her productions.</p>
            </div>

            <p className="text-gray-400">What follows is a collection of journal entries, observations, and reflections that I wrote over the course of several months as I went through the audition process, got cast, and began rehearsals for this production.</p>

            <p className="text-gray-500 italic">I had no idea how the story would end when I began writing it.</p>
          </div>
        </section>

        <section id="section1" className="mb-40">
          <div className="mb-8">
            <span className="text-purple-400 text-sm uppercase tracking-widest">December 16, 2019</span>
            <h2 className="text-4xl font-serif mt-2 text-purple-200">1: the audition</h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <div className="text-center py-6">
              <p className="text-sm text-purple-300 italic">"The actor who honestly examines himself and his shortcomings, courageously accepts criticism, and persistently searches for ways to develop his talents, will inevitably experience that special joy known only to true artists."</p>
              <p className="text-xs text-gray-500 mt-2">— Michael Chekhov</p>
            </div>

            <p className="text-gray-300">I arrive at SLAC at 6:50 for my 7pm audition slot. I'm in the lobby looking at the poster for <span className="italic">How to Transcend a Happy Marriage</span>.</p>

            <p className="text-gray-400">The poster shows a man and woman sitting on the floor in the lotus position, nude except for their undergarments. Between them is a fawn. The whole image is flooded with purple light. It's surreal and striking.</p>

            <div className="bg-purple-950/20 p-6 rounded my-8">
              <p className="text-purple-200 italic">I'm nervous. My hands are sweating.</p>
            </div>

            <p className="text-gray-400">I sign in and sit in the greenroom with the other actors. Some I know, some I don't. We make small talk. Someone asks if anyone has read the play. A few of us have. We talk about Sarah Ruhl, about her other plays.</p>

            <p className="text-gray-300">When it's my turn, I walk into the theatre. The director, Cynthia, is sitting in the house with the stage manager and casting director. The lights are up on stage. There's a simple table and two chairs.</p>

            <p className="text-gray-400">"Hi Topher," Cynthia says warmly. "Thanks for coming in. Tell us what you prepared."</p>

            <p className="text-gray-300">I tell them I've prepared a monologue from <span className="italic">The Seagull</span> by Anton Chekhov. I chose Konstantin's monologue from Act 4, right before he exits to shoot himself.</p>

            <div className="my-12 space-y-6">
              <p className="text-xl text-purple-300 italic">The Monologue</p>
              
              <div className="bg-slate-900/50 p-8 rounded space-y-4 text-gray-300 italic">
                <p>"For two years now I haven't written a single line, and I feel as though I've been cast into some deep pit, and I can't see anything except earth all around. I used to have faith in something, I had a goal, but now all I have are empty dreams and confused thoughts. My own life is a mystery to me."</p>
              </div>

              <p className="text-gray-400">I perform the monologue. I feel my voice shaking slightly at the beginning, but then something shifts. I feel myself dropping into the character's desperation. My breathing changes. I feel heat in my chest.</p>

              <p className="text-purple-200 italic">For a moment, I am Konstantin. I feel his despair, his artistic frustration, his desire to be seen and understood.</p>

              <p className="text-gray-400">When I finish, there's a beat of silence. Cynthia nods thoughtfully.</p>

              <p className="text-gray-300">"Thank you, Topher. That was really lovely. Can you stay for sides?"</p>
            </div>

            <p className="text-gray-400">They hand me a scene from <span className="italic">How to Transcend</span>. I'm reading for the role of Freddie, a young man who becomes involved with an older couple exploring polyamory.</p>

            <p className="text-gray-300">I read the scene with another actor. It's funny and awkward and strange. I try to find moments of truth in it, moments of real human connection beneath the comedy.</p>

            <div className="bg-purple-950/20 p-6 rounded my-8">
              <p className="text-gray-300">After the audition, I drive home in the dark. My hands are still shaking slightly. I feel alive and terrified and exhilarated.</p>
              <p className="text-purple-200 italic mt-4">This is why I act.</p>
            </div>
          </div>
        </section>

        <section id="section2" className="mb-40">
          <div className="mb-8">
            <span className="text-orange-400 text-sm uppercase tracking-widest">December 18, 2019</span>
            <h2 className="text-4xl font-serif mt-2 text-orange-200">2: anticipation</h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-gray-300">Two days after the audition, I still haven't heard anything. I check my email obsessively. I refresh my phone. I try to distract myself with other work, but my mind keeps returning to the audition.</p>

            <p className="text-gray-400 italic">Did I do well? Did they like me? Will they call me back?</p>

            <p className="text-gray-300">This is one of the hardest parts of being an actor: the waiting. The not knowing. The vulnerability of having put yourself out there and then having to wait for someone else's judgment.</p>

            <div className="bg-orange-950/20 p-6 rounded my-8">
              <p className="text-orange-200 italic">"The actor must learn to wait in a state of readiness, without anxiety or impatience."</p>
              <p className="text-xs text-gray-500 mt-2">— Michael Chekhov</p>
            </div>

            <p className="text-gray-400">But I'm not in a state of readiness without anxiety. I'm anxious. I'm checking my email every five minutes. I'm running through the audition in my head, analyzing every choice I made, every line reading, every moment.</p>

            <p className="text-gray-500 italic">Could I have done it differently? Should I have made different choices?</p>

            <div className="my-12 space-y-6">
              <p className="text-xl text-orange-300 italic">December 19, 2019</p>
              
              <p className="text-gray-300">Still nothing. I try to let it go. I remind myself that casting takes time, that there are many factors involved, that it's not personal.</p>

              <p className="text-gray-400">But it feels personal. Acting always feels personal because you are the instrument. Your body, your voice, your emotions, your memories—these are the tools of your craft.</p>

              <p className="text-orange-200 italic">When someone rejects your acting, it can feel like they're rejecting you.</p>
            </div>

            <div className="my-12 space-y-6">
              <p className="text-xl text-orange-300 italic">December 20, 2019 — The Email</p>
              
              <p className="text-gray-300">I get the email at 3:47 PM.</p>

              <div className="bg-slate-900/50 p-6 rounded my-8">
                <p className="text-gray-300">"Hi Topher, Thank you so much for auditioning for <span className="italic">How to Transcend a Happy Marriage</span>. We would love to have you come back for callbacks on December 22nd at 2 PM. Please let us know if you're available. Best, Cynthia"</p>
              </div>

              <p className="text-orange-200 italic text-xl">I got a callback.</p>

              <p className="text-gray-300">I feel a rush of relief and excitement and terror all at once. The waiting is over, but now there's a new kind of waiting. A new kind of pressure.</p>

              <p className="text-gray-400">I respond immediately: "Yes, I'll be there. Thank you."</p>

              <p className="text-gray-500 italic">And then I start preparing for the callback.</p>
            </div>
          </div>
        </section>

        <section id="section3" className="mb-40">
          <div className="mb-8">
            <span className="text-red-400 text-sm uppercase tracking-widest">December 21, 2019</span>
            <h2 className="text-4xl font-serif mt-2 text-red-200">3: another actor prepares</h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <div className="text-center py-6">
              <p className="text-sm text-red-300 italic">"Preparation begins long before the first rehearsal."</p>
              <p className="text-xs text-gray-500 mt-2">— Uta Hagen</p>
            </div>

            <p className="text-gray-300">I have one day to prepare for the callback. I re-read the play. I make notes on my sides. I think about who Freddie is, what he wants, why he makes the choices he makes.</p>

            <p className="text-gray-400">Freddie is young—early twenties. He's a musician. He's earnest and sweet and a little naive. He gets swept up in this older couple's world, their experiments with polyamory, their philosophical discussions about love and desire.</p>

            <p className="text-red-200 italic">What does Freddie want? Connection. Understanding. To be seen.</p>

            <div className="bg-red-950/20 p-6 rounded my-8">
              <p className="text-gray-300">I think about times in my own life when I felt like Freddie. When I was young and eager to please. When I was searching for connection and willing to put myself in vulnerable situations to find it.</p>
              <p className="text-gray-400 mt-4 italic">This is the work of acting: finding the intersection between the character's life and your own.</p>
            </div>

            <p className="text-gray-400">I practice the sides out loud. I try different line readings. I experiment with physicality. I'm looking for the truth of the character, the moments where I can connect with something real.</p>

            <div className="my-12 space-y-6">
              <p className="text-xl text-red-300 italic">The Inner Work</p>
              
              <p className="text-gray-300">There's also an inner preparation that's harder to describe. It involves quieting the critical voice in my head, the voice that says "you're not good enough" or "they won't cast you" or "you're going to mess this up."</p>

              <p className="text-gray-400">I try to replace that voice with something more supportive. I remind myself that I've done this before. That I'm trained. That I have something unique to offer.</p>

              <p className="text-red-200 italic">But the fear is still there, humming beneath the surface.</p>

              <div className="bg-slate-900/50 p-6 rounded my-8">
                <p className="text-gray-400 italic">"The actor's instrument is himself—his body, voice, imagination, and emotions. To use this instrument well requires constant practice and deep self-knowledge."</p>
                <p className="text-xs text-gray-500 mt-2">— Michael Chekhov</p>
              </div>
            </div>

            <p className="text-gray-300">The night before the callback, I can't sleep. I lie in bed running through the scenes in my head. I visualize walking into the room, greeting the director, performing the sides with confidence and openness.</p>

            <p className="text-gray-400 italic">I try to let go of the outcome. To focus on the process, on doing good work, on being present.</p>

            <p className="text-red-200 text-xl italic mt-8">But I really want this role.</p>
          </div>
        </section>

        <section id="section4" className="mb-40">
          <div className="mb-8">
            <span className="text-yellow-400 text-sm uppercase tracking-widest">December 22, 2019</span>
            <h2 className="text-4xl font-serif mt-2 text-yellow-200">4: the callbacks</h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-gray-300">I arrive at SLAC fifteen minutes early. The greenroom is more crowded this time. I recognize several of the actors from the initial auditions. We're all here for callbacks, all competing for the same roles.</p>

            <p className="text-gray-400">There's a strange energy in the room—part camaraderie, part competition. We're all actors, we understand each other's anxiety, but we also all want the same thing.</p>

            <div className="bg-yellow-950/20 p-6 rounded my-8">
              <p className="text-yellow-200 italic">I try to stay focused on my own preparation, on my own work. I try not to compare myself to the other actors in the room.</p>
              <p className="text-gray-400 mt-4">But it's hard not to notice how talented everyone is.</p>
            </div>

            <p className="text-gray-300">When they call my name, I walk into the theatre. This time, there are more people watching—assistant directors, designers, producers. The stakes feel higher.</p>

            <p className="text-gray-400">Cynthia greets me warmly. "Hi Topher, thanks for coming back. We're going to have you read a few different scenes today. We'll start with the scene you read at your initial audition, and then we'll try some new ones."</p>

            <div className="my-12 space-y-6">
              <p className="text-xl text-yellow-300 italic">The First Scene</p>
              
              <p className="text-gray-300">I read with an actress named Sarah. She's reading for the role of Pip, one half of the couple who brings Freddie into their world.</p>

              <p className="text-gray-400">Something clicks. I feel connected to Sarah's energy. I feel like I'm really listening, really responding. The scene comes alive in a way it didn't during my initial audition.</p>

              <p className="text-yellow-200 italic">This is what acting should feel like: alive, spontaneous, real.</p>

              <p className="text-gray-300">We finish the scene. Cynthia is smiling. "That was great. Let's try the scene from Act 2."</p>
            </div>

            <p className="text-gray-400">We read several more scenes. Each one feels better than the last. I'm finding my rhythm, finding the character's voice, finding moments of humor and vulnerability.</p>

            <div className="bg-slate-900/50 p-6 rounded my-8">
              <p className="text-gray-300">"Thank you, Topher," Cynthia says when we're done. "That was really wonderful. We'll be in touch soon."</p>
              <p className="text-gray-400 mt-4">I thank them and leave. As I walk out of the theatre, I feel good about how it went. Not perfect, but good. I feel like I did my best work.</p>
              <p className="text-yellow-200 italic mt-4">Now comes the hardest part: waiting to hear if I got the role.</p>
            </div>
          </div>
        </section>

        <section id="section5" className="mb-40">
          <div className="mb-8">
            <span className="text-blue-400 text-sm uppercase tracking-widest">January 3, 2020</span>
            <h2 className="text-4xl font-serif mt-2 text-blue-200">5: choosing the role</h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-gray-300">The holidays pass in a blur of family gatherings and forced cheer. I try not to think about the callback, but it's always there in the back of my mind.</p>

            <div className="my-12 space-y-6">
              <p className="text-xl text-blue-300 italic">January 3, 2020 — The Call</p>
              
              <p className="text-gray-300">Cynthia calls me on the morning of January 3rd. My heart is racing before I even answer the phone.</p>

              <p className="text-gray-400">"Hi Topher, I wanted to give you a call about <span className="italic">How to Transcend</span>. We were really impressed with your work at callbacks. We'd like to offer you the role of Freddie."</p>

              <div className="bg-blue-950/20 p-6 rounded text-center my-8">
                <p className="text-2xl text-blue-200 italic">I got the role.</p>
              </div>

              <p className="text-gray-300">I try to sound calm and professional on the phone, but inside I'm screaming. After I hang up, I sit in my car for a few minutes, just breathing, trying to process what just happened.</p>

              <p className="text-blue-200 italic">All the anxiety, all the preparation, all the waiting—it was worth it.</p>
            </div>

            <div className="my-12 space-y-6">
              <p className="text-xl text-blue-300 italic">The Reality Sets In</p>
              
              <p className="text-gray-400">But alongside the excitement, there's also fear. Now I actually have to do it. I have to show up to rehearsals every day and create this character from scratch. I have to work with a director and other actors and find my way through this complex, strange, beautiful play.</p>

              <p className="text-gray-300">I think about something Michael Chekhov wrote about the moment of accepting a role:</p>

              <div className="bg-slate-900/50 p-6 rounded my-8">
                <p className="text-gray-400 italic">"When the actor accepts a role, he takes on a great responsibility. He must bring this character to life, give it breath and depth and truth. It is both a privilege and a burden."</p>
              </div>
            </div>

            <p className="text-gray-400">I also learn around this time that I've been cast in another show that rehearses at the same time—a production of <span className="italic">The Seagull</span> where I'll be playing Konstantin, the role whose monologue I performed at my audition for <span className="italic">How to Transcend</span>.</p>

            <p className="text-gray-300">Two roles. Two rehearsal processes happening simultaneously. Two opportunities to grow as an actor.</p>

            <p className="text-blue-200 italic mt-8">It was a perfect ending to ten years of struggle, a victory with overlapping meanings.</p>

            <div className="bg-slate-900/50 p-6 rounded my-8">
              <p className="text-gray-400">He called me as I was writing. He has chosen to cast another actor who "looks like he could be Deena's son". He's never worked with this guy before and he wanted to let me know it wasn't because of anything I did. He said the work I did was great and that he can't wait to work with me in the future. He sounded like a sad dog.</p>

              <p className="text-gray-500 mt-4">I don't intend to spend a lot of energy on my disappointment about the lost opportunity of Konstantin, but it would have been a great challenge.</p>
            </div>

            <p className="text-gray-300">And then I return to the script of <span className="italic">How to Transcend</span> and I remember how much I love the play. And I remember the actors I'm going to be acting with.</p>

            <p className="text-blue-200 italic">And all over again I am thrilled and excited and nervous and happy.</p>

            <p className="text-gray-400 italic">Have I become a better actor? Better than what?</p>
          </div>
        </section>

        <section id="section6" className="mb-40">
          <div className="mb-8">
            <span className="text-green-400 text-sm uppercase tracking-widest">March 9, 2020</span>
            <h2 className="text-4xl font-serif mt-2 text-green-200">6: rehearsal begins</h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <div className="text-center py-6">
              <p className="text-sm text-green-300 italic">The more he becomes acquainted with the play and the character, the more strongly his actor's intuition begins to raise its voice. Innumerable possibilities and individual ways are opened.</p>
              <p className="text-xs text-gray-500 mt-2">— Michael Chekhov</p>
            </div>

            <p className="text-xl text-green-300 italic">March 9, 2020 — first read</p>

            <p className="text-gray-300">We have arrived at a key moment. In addition to the actors, I meet the designers, the assistants, the director. We sit quietly and sign our contracts. 25 people sit in the green room to hear the play.</p>
            
            <p className="text-gray-300">The scenic designer discusses the scenic design and projection mapping. The puppeteers demonstrate the articulation of the Recently Slaughtered Deer. I laugh with the 3 actors I know and smile with the 4 actors I don't.</p>

            <p className="text-gray-300">My nervous system is wildly active during the entire readthrough. I feel tense and relaxed at once. I can feel my heart beating. From the beginning, it's like my spine is a xylophone getting played up and down.</p>
            
            <div className="bg-green-950/20 p-6 rounded text-center my-8">
              <p className="text-2xl text-green-200">I write down "fuck I love this play."</p>
            </div>

            <p className="text-gray-400">Earlier I was concerned with the size of my role but while we are reading the play that concern dissolves.</p>
            
            <p className="text-gray-300 italic text-xl">The story being told, the play itself—that's why I'm here.</p>

            <div className="my-12 space-y-6">
              <p className="text-xl text-green-300 italic">March 10, 2020 — table work</p>

              <p className="text-gray-400">Before we get on our feet, we read the play again without the audience, stopping to discuss when things arise. We slow down the play, peer into its internal structure, and define our understanding of it as a group.</p>

              <p className="text-gray-300">Actors respond in different ways to this part of the process. Some don't care about analysis, they want to just start acting it. Others feel like they're being grilled, that the director is testing their knowledge of the play.</p>

              <p className="text-green-200 italic">For me, this exploration is thrilling.</p>

              <p className="text-gray-400">The director asks questions of the actors, about their characters— things like <span className="italic">how long have you two been married?</span></p>

              <p className="text-gray-400">There are clues in the text— clues for everything. Even though the decision seems arbitrary, specificity leads to richness.</p>

              <p className="text-gray-500">As Dah-Veed speaks, I recite his lines in my head. All that preparation never went anywhere.</p>
            </div>
          </div>
        </section>

        <section id="section7" className="mb-40">
          <div className="mb-8">
            <span className="text-gray-600 text-sm uppercase tracking-widest">March 21–April 2020</span>
            <h2 className="text-4xl font-serif mt-2 text-gray-400">7: collapse</h2>
          </div>

          <div className="space-y-8 text-lg leading-relaxed">
            <p className="text-3xl text-gray-300">well that was fucking crazy</p>
            
            <p className="text-gray-400">Since last week, everything has changed. Not just in my world but the world at large. SLAC has given us two weeks to take care of ourselves and our loved ones. I stopped everything. We hunkered down.</p>

            <p className="text-gray-400">I raked the dead leaves from the back yard and stood in the sun.</p>

            <p className="text-gray-400 italic">The play won't happen this year. How do I talk about this?</p>

            <div className="bg-slate-900/80 p-8 rounded space-y-6 my-12">
              <p className="text-gray-400">I'm relieved that the play will be postponed because this mysterious contagion is spreading exponentially. Theatres are potential hotbeds of coronavirus.</p>
              
              <p className="text-gray-400">The outbreak snuck its way into every aspect of my life, of everyone's lives. We're facing a global recession and weeks of social isolation.</p>

              <p className="text-gray-400">Broadway is shut down, all the local theatre productions are canceled, movie theatres even, restaurants, bars, sporting events, anything that brings people together in physical space.</p>

              <p className="text-gray-500 italic">Salt Lake County has made groups of 10 or more people illegal.</p>
              
              <p className="text-gray-500 italic mt-6">The culminating piece of this project, the center, is gone. Not gone. Delayed.</p>
              
              <p className="text-gray-600 italic">who cares about my stupid play in the middle of a global pandemic?</p>
            </div>

            <div className="my-12 bg-slate-900/50 p-8 rounded space-y-6">
              <p className="text-gray-400">During the first week of quarantine, Cassie and I were shaken awake by what turned out to be a 5.7 earthquake NNE of Magna. It seemed impossible because we had already hunkered down, we were already freaked out about the virus, disinfecting everything, SLAC shut down, everything shut down.</p>

              <p className="text-gray-500 italic">Then, a quake?</p>

              <p className="text-gray-400">On Instagram, Sarah Ruhl offered to send 44 copies of her brand new book of poetry to followers who would send her a poem. We were lying in bed when I read her post, still quaking internally and baffled.</p>
            </div>

            <div className="bg-blue-900/10 p-8 rounded my-12 space-y-4 italic text-blue-200">
              <p className="text-sm text-gray-500">I sent her a message:</p>
              
              <div className="text-gray-300 space-y-4 pl-4 border-l-2 border-blue-400/30">
                <p>It's been 15 years since I wrote a poem.</p>
                <p>we were stilling,<br/>
                Found time to move<br/>
                the dead leaves from before.</p>
                <p>Resting to deepen,<br/>
                moving to deepen.<br/>
                Sabbath.</p>
                <p>Then,<br/>
                Still dark, the bed shakes us awake this morning<br/>
                5.7 earthquake, outside Salt Lake City<br/>
                Fourteen aftershocks so far.</p>
                <p>The golden angel on top of the Mormon temple<br/>
                drops his trumpet</p>
                <p>Two emergencies at once?<br/>
                Ten? A trillion?</p>
                <p>And the water in Vienna is crystal,<br/>
                At least according to Twitter</p>
                <p>I wouldn't choose immunity from thunder<br/>
                Or from snowfall or sunburn</p>
                <p className="text-blue-200">This body has many temperatures inside it.</p>
              </div>

              <p className="text-sm text-gray-500 mt-8">A few nights previous I had encountered Sarah Ruhl in a dream and instead of her signature calm insight and depth, she was frustrated with my academic impotence and handed me a harshly graded crayon drawing that someone else had drawn.</p>

              <p className="text-blue-300 text-lg mt-8">I woke up an hour later to her response:</p>
              <p className="text-gray-300 pl-4 border-l-2 border-blue-400/30">"your poem made my cry today. I'm so grateful. Freddie!!! Hooray! Sorry it's postponed but hope the waiting has sweetness. be well, book will be winging its way to you soon, Sarah"</p>
            </div>

            <div className="border-t border-gray-800 pt-8 my-12">
              <p className="text-xl text-gray-400 italic">April 10, 2020 — opening night</p>
              
              <p className="text-gray-400">For days I have been making phone calls, letting ticketholders know that <span className="italic">How To Transcend</span> is being postponed, and what would you like to do with your tickets?</p>

              <p className="text-gray-400">Tonight would have been Opening Night, the big celebration, the culmination of all of our work and the beginning of a five-week run of performances.</p>

              <p className="text-gray-300 text-xl mt-8">Partway through the day, I get the news that J Todd (the actor playing Paul in our production) has committed suicide.</p>
            </div>

            <div className="my-16 space-y-6 text-gray-400">
              <p>March 12 was our final rehearsal before we were put on immediate hiatus. We were still in our first week, and still getting to know each other.</p>
              
              <p>J Todd was cracking jokes and going to smoke and telling stories of playing Tybalt and Pistol and That Awful Production of Three Musketeers and talking about how housing worked for the Utah Shakespeare Festival.</p>
              
              <p>On March 12 I sat next to him on a break and asked him "So, Todd, What happens after you die?"</p>

              <p className="text-gray-500 italic">And now I wish I hadn't asked that question.</p>

              <p>J Todd's sister mentioned alcohol and depression in her post.</p>

              <p>J Todd was gregarious and wiry, eager to go out for a smoke, old school. He'd been acting forever, it seemed, in all these cities, for all these theatres, he'd done the classics, he was a stage combat savant.</p>

              <p>At the first readthrough, he asked everyone in the room to keep an eye out for an apartment nearby, he was hoping to sublet.</p>

              <p className="text-gray-600 italic mt-8">I will never know the reasons why J Todd killed himself.</p>
            </div>

            <p className="text-gray-400">Stanislavski's 1917 note about Konstantin came back up in my thinking:</p>
            
            <div className="bg-slate-900/50 p-6 rounded italic text-gray-400 my-8">
              <p>"He decided to commit suicide not because he didn't want to live, but because he passionately wants to live, he grasps at everything that offers a foothold in life, but everything collapses."</p>
            </div>

            <p className="text-gray-400">SARS-CoV-2 has incited the collapse of live theatre, at least for a while. If an actor's got a play they're working on, even one a year from now, they've got something. If all the theatres shut down, that takes a toll.</p>

            <p className="text-gray-500 italic">I could never assign a reason for J Todd's suicide because I never really knew him.</p>

            <div className="my-12 space-y-6">
              <p className="text-xl text-gray-400 italic">April 14, 2020 — approaching the end</p>

              <p className="text-gray-400">What am I left with at the end of this journey?</p>

              <p className="text-gray-400">In one of my first writings, I had all these ideas for a play or a guidebook for actors or some sort of performance, and instead, I have a collection of my experiences and the thoughts and feelings that went along with them.</p>

              <p className="text-gray-500">I fear that I've left the reader with an altogether anxious and depressed jumble, that I haven't offered the reader any solutions or conclusions. The play could have been a victorious ending, but it fell away and was replaced with global catastrophe, loss, and great uncertainty.</p>

              <div className="bg-slate-900/50 p-6 rounded my-8">
                <p className="text-gray-400 italic">"The performance is in reality a mutual creation of actors and audience, and the Atmosphere is an irresistible bond between actor and audience, a medium with which the audience can inspire the actors by sending them waves of confidence, understanding, and love."</p>
                <p className="text-xs text-gray-500 mt-2">— Michael Chekhov</p>
              </div>

              <p className="text-gray-400">I remain afraid of being observed, absorbed with the possibility of being judged, criticized, or found wanting. Imagining a benevolent audience sending waves of understanding makes my body soften and reminds me of the reasons why I love to act on the stage.</p>

              <p className="text-gray-500 italic">I don't know when audiences will be able to gather safely again.</p>
            </div>
          </div>
        </section>

        <section id="conclusion" className="mb-40">
          <h2 className="text-4xl font-serif mb-12 text-gray-300">Conclusion</h2>
          
          <div className="space-y-8 text-lg leading-relaxed">
            <div className="text-center py-6">
              <p className="text-sm text-gray-400 italic">From the very beginning of his study, he has been inside the character; his reward will be his own inner growth.</p>
              <p className="text-xs text-gray-500 mt-2">— Michael Chekhov</p>
            </div>

            <p className="text-gray-400">Here is the place where I wrap up this thesis. I again sit 
            facing a shifting mass of possibilities, but they look nothing like I could have predicted. I will return to this section over the coming weeks and try to say something that feels like an ending.</p>

            <div className="my-12 space-y-6">
              <p className="text-xl text-gray-400 italic">April 21, 2020 — results &amp; discussion</p>

              <p className="text-gray-400">Despite the upside-down ending to this narrative, I feel 
              that I have captured succinctly the psychology of being myself as an actor and harvested the thoughts and feelings that made up my preparatory process in the face of rehearsal and performance.</p>
            </div>

            <div className="bg-slate-900/50 p-8 rounded my-12">
              <p className="text-gray-300 mb-4">The transformations I have undergone over the course of this project include:</p>
              <div className="mt-4 space-y-3 text-gray-400 pl-6 border-l-2 border-blue-400/30">
                <p>my capacity for and appreciation of ambiguity and ambivalence, which has increased</p>
                <p>my relationship with the work of Sarah Ruhl, which has deepened and veered</p>
                <p>my relationship with my ability to write and to act, which has softened and widened</p>
                <p>the length of my hair, which is now longer than it's ever been</p>
                <p>the length of this thesis, which is the largest piece of writing I've ever written</p>
                <p>my appreciation for the possibility of theatrical events, which has begun to ache</p>
                <p>my relationship to the inevitability of death and the myriad means by which it can happen, which became starker and more present suddenly and unexpectedly</p>
                <p>a sense of ownership of sensations and impulses arising in my body, which unfolded</p>
              </div>
            </div>

            <p className="text-gray-400"><span className="italic">How to Transcend</span> happens next 
            spring. The work I have done on my role, some of which I hope is represented here in this writing, will continue. I will continue to transform. And, I'm sure, more great uncertainty is on its way.</p>

            <p className="text-gray-400">I am currently experiencing a glowing sort of spacious warmth as I type these words, thinking back on the work I have done and the work I will continue to do.</p>

            <div className="my-16 text-center space-y-6">
              <p className="text-3xl text-gray-300 italic">I tried to tell the truth.</p>
              <p className="text-xl text-gray-500">I know it wasn't science but I hope it held some value to you.</p>
            </div>

            <div className="bg-gradient-to-br from-blue-950 to-slate-900 p-12 rounded-lg text-center mt-20">
              <p className="text-2xl text-blue-200 italic leading-relaxed mb-6">
                "From the very beginning of his study, he has been inside the character;<br/>
                his reward will be his own inner growth."
              </p>
              <p className="text-gray-400">— Michael Chekhov, <span className="italic">On the Technique of Acting</span></p>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-8">
            <p className="text-gray-500 italic text-lg">Later:</p>
            <p className="text-gray-400 italic text-xl">"I learned that I could confront oncoming waves directly,</p>
            <p className="text-gray-300 italic text-xl">dipping beneath the crest of the billow</p>
            <p className="text-gray-200 italic text-xl">and emerging on the other side</p>
            <p className="text-gray-300 italic text-xl">and looking back to watch it crash."</p>
            
            <div className="mt-16 pt-16 border-t border-gray-800">
              <p className="text-sm text-gray-600">Salt Lake City, Utah</p>
              <p className="text-sm text-gray-700 mb-4">Spring 2020</p>
              <p className="text-xs text-gray-800 italic">How to Transcend a Happy Marriage</p>
              <p className="text-xs text-gray-800 italic">Postponed, not cancelled</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticIntrospections;
