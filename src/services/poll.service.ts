import { supabase } from "../lib/supabase";


/* =========================================================
   TYPES
========================================================= */

export interface PollGame {
  id: string;
  twitch_game_id: string | null;
  twitch_name: string;
  box_art_url: string | null;
  description: string | null;
  rating: number | null;
  poll_enabled: boolean | null;
}


export interface PollOption {
  id: string;
  poll_id: string;
  game_id: string;
  position: number;
  created_at: string;

  game: PollGame | null;

  votes: number;
  percentage: number;
}


export interface Poll {
  id: string;

  slug: string | null;

  question: string | null;

  status: string;

  created_at: string;
  updated_at: string;

  title: string | null;
  description: string | null;
  category: string | null;

  starts_at: string | null;
  ends_at: string | null;

  results_visible: boolean;

  allow_suggestions: boolean;

  winner: string | null;

  options: PollOption[];

  totalVotes: number;
}


export interface PollVote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}


export interface PollSuggestion {
  id: string;

  category: string;

  question: string;

  description: string;

  user_id: string | null;

  status: string;

  created_at: string;
  updated_at: string;
}


export interface PollResults {
  options: PollOption[];
  totalVotes: number;
}


interface PollVoteResult {
  poll_id: string;
  option_id: string;
  votes: number;
}


/* =========================================================
   HELPERS
========================================================= */

function calculatePercentage(
  votes: number,
  totalVotes: number
): number {

  if (totalVotes <= 0) {
    return 0;
  }

  return Math.round(
    (
      votes /
      totalVotes
    )
    *
    100
  );
}


/* =========================================================
   CHECK POLL STATUS / DATES
========================================================= */

function isPollCurrentlyOpen(
  poll: {
    status?: string | null;
    starts_at?: string | null;
    ends_at?: string | null;
  }
): boolean {

  if (
    poll.status
    &&
    poll.status !== "active"
  ) {
    return false;
  }


  const now =
    new Date();


  if (poll.starts_at) {

    const startsAt =
      new Date(
        poll.starts_at
      );


    if (
      Number.isNaN(
        startsAt.getTime()
      )
    ) {
      return false;
    }


    if (
      now <
      startsAt
    ) {
      return false;
    }

  }


  if (poll.ends_at) {

    const endsAt =
      new Date(
        poll.ends_at
      );


    if (
      Number.isNaN(
        endsAt.getTime()
      )
    ) {
      return false;
    }


    if (
      now >
      endsAt
    ) {
      return false;
    }

  }


  return true;
}


/* =========================================================
   GET CURRENT USER
========================================================= */

export async function getCurrentPollUser() {

  const {
    data,
    error
  } =
    await supabase.auth.getUser();


  if (error) {

    if (
      error.name ===
      "AuthSessionMissingError"
    ) {
      return null;
    }


    console.error(
      "Erreur récupération utilisateur :",
      error
    );

    throw error;
  }


  return (
    data.user
    ??
    null
  );
}


/* =========================================================
   GET POLL OPTIONS
========================================================= */

async function getPollOptions(
  pollId: string
): Promise<PollOption[]> {

  const {
    data,
    error
  } =
    await supabase
      .from(
        "poll_options"
      )
      .select(`
        id,
        poll_id,
        game_id,
        position,
        created_at,

        game:games (
          id,
          twitch_game_id,
          twitch_name,
          box_art_url,
          description,
          rating,
          poll_enabled
        )
      `)
      .eq(
        "poll_id",
        pollId
      )
      .order(
        "position",
        {
          ascending: true
        }
      );


  if (error) {

    console.error(
      "Erreur récupération options du sondage :",
      error
    );

    throw error;
  }


  return (
    data
    ??
    []
  ).map(
    (option: any): PollOption => ({

      id:
        option.id,

      poll_id:
        option.poll_id,

      game_id:
        option.game_id,

      position:
        option.position
        ??
        0,

      created_at:
        option.created_at,

      game:
        option.game
        ??
        null,

      votes:
        0,

      percentage:
        0

    })
  );
}


/* =========================================================
   GET PUBLIC POLL RESULTS
========================================================= */

async function getPollVoteResults(
  pollId: string
): Promise<PollVoteResult[]> {

  const {
    data,
    error
  } =
    await supabase
      .from(
        "poll_results"
      )
      .select(`
        poll_id,
        option_id,
        votes
      `)
      .eq(
        "poll_id",
        pollId
      );


  if (error) {

    console.error(
      "Erreur récupération résultats :",
      error
    );

    throw error;
  }


  return (
    data
    ??
    []
  ).map(
    (result: any): PollVoteResult => ({

      poll_id:
        result.poll_id,

      option_id:
        result.option_id,

      votes:
        Number(
          result.votes
          ??
          0
        )

    })
  );
}


/* =========================================================
   ATTACH RESULTS
========================================================= */

function attachResults(
  options: PollOption[],
  results: PollVoteResult[]
): PollResults {

  const voteMap:
    Record<string, number> =
    {};


  let totalVotes =
    0;


  for (
    const result of results
  ) {

    const count =
      Number(
        result.votes
        ??
        0
      );


    voteMap[
      result.option_id
    ] =
      count;


    totalVotes +=
      count;

  }


  const enrichedOptions =
    options.map(
      (
        option
      ): PollOption => {

        const voteCount =
          voteMap[
            option.id
          ]
          ??
          0;


        return {

          ...option,

          votes:
            voteCount,

          percentage:
            calculatePercentage(
              voteCount,
              totalVotes
            )

        };

      }
    );


  return {

    options:
      enrichedOptions,

    totalVotes

  };
}


/* =========================================================
   GET POLL BY ID
========================================================= */

export async function getPollById(
  pollId: string
): Promise<Poll | null> {

  const {
    data: poll,
    error
  } =
    await supabase
      .from(
        "polls"
      )
      .select(`
        id,
        slug,
        question,
        status,
        created_at,
        updated_at,
        title,
        description,
        category,
        starts_at,
        ends_at,
        results_visible,
        allow_suggestions,
        winner
      `)
      .eq(
        "id",
        pollId
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Erreur récupération sondage :",
      error
    );

    throw error;
  }


  if (!poll) {
    return null;
  }


  const [
    options,
    results
  ] =
    await Promise.all([

      getPollOptions(
        poll.id
      ),

      getPollVoteResults(
        poll.id
      )

    ]);


  const {
    options: enrichedOptions,
    totalVotes
  } =
    attachResults(
      options,
      results
    );


  return {

    ...poll,

    options:
      enrichedOptions,

    totalVotes

  } as Poll;
}


/* =========================================================
   GET POLL BY SLUG
========================================================= */

export async function getPollBySlug(
  slug: string
): Promise<Poll | null> {

  const {
    data: poll,
    error
  } =
    await supabase
      .from(
        "polls"
      )
      .select(`
        id,
        slug,
        question,
        status,
        created_at,
        updated_at,
        title,
        description,
        category,
        starts_at,
        ends_at,
        results_visible,
        allow_suggestions,
        winner
      `)
      .eq(
        "slug",
        slug
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Erreur récupération sondage par slug :",
      error
    );

    throw error;
  }


  if (!poll) {
    return null;
  }


  return getPollById(
    poll.id
  );
}


/* =========================================================
   GET ACTIVE POLL
========================================================= */

export async function getActivePoll():
  Promise<Poll | null> {

  const {
    data: polls,
    error
  } =
    await supabase
      .from(
        "polls"
      )
      .select(`
        id,
        slug,
        question,
        status,
        created_at,
        updated_at,
        title,
        description,
        category,
        starts_at,
        ends_at,
        results_visible,
        allow_suggestions,
        winner
      `)
      .eq(
        "status",
        "active"
      )
      .order(
        "created_at",
        {
          ascending:
            false
        }
      );


  if (error) {

    console.error(
      "Erreur récupération sondage actif :",
      error
    );

    throw error;
  }


  const validPoll =
    (
      polls
      ??
      []
    ).find(
      poll =>
        isPollCurrentlyOpen(
          poll
        )
    );


  if (!validPoll) {
    return null;
  }


  return getPollById(
    validPoll.id
  );
}


/* =========================================================
   GET USER VOTE
========================================================= */

export async function getUserVote(
  pollId: string
): Promise<PollVote | null> {

  const user =
    await getCurrentPollUser();


  if (!user) {
    return null;
  }


  const {
    data,
    error
  } =
    await supabase
      .from(
        "poll_votes"
      )
      .select(`
        id,
        poll_id,
        option_id,
        user_id,
        created_at
      `)
      .eq(
        "poll_id",
        pollId
      )
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Erreur vérification vote utilisateur :",
      error
    );

    throw error;
  }


  return (
    data
    ??
    null
  ) as PollVote | null;
}


/* =========================================================
   HAS USER VOTED
========================================================= */

export async function hasUserVoted(
  pollId: string
): Promise<boolean> {

  const vote =
    await getUserVote(
      pollId
    );


  return Boolean(
    vote
  );
}


/* =========================================================
   VOTE FOR OPTION
========================================================= */

export async function voteForOption(
  pollId: string,
  optionId: string
): Promise<PollVote> {

  /* =======================================================
     1. USER
  ======================================================= */

  const user =
    await getCurrentPollUser();


  if (!user) {

    throw new Error(
      "Tu dois être connecté à ton compte POUP pour voter."
    );

  }


  /* =======================================================
     2. POLL
  ======================================================= */

  const {
    data: poll,
    error: pollError
  } =
    await supabase
      .from(
        "polls"
      )
      .select(`
        id,
        status,
        starts_at,
        ends_at
      `)
      .eq(
        "id",
        pollId
      )
      .maybeSingle();


  if (pollError) {

    console.error(
      "Erreur vérification sondage :",
      pollError
    );

    throw pollError;
  }


  if (!poll) {

    throw new Error(
      "Ce sondage n'existe pas."
    );

  }


  if (
    !isPollCurrentlyOpen(
      poll
    )
  ) {

    throw new Error(
      "Ce sondage est actuellement fermé."
    );

  }


  /* =======================================================
     3. OPTION
  ======================================================= */

  const {
    data: option,
    error: optionError
  } =
    await supabase
      .from(
        "poll_options"
      )
      .select(`
        id,
        poll_id,
        game_id
      `)
      .eq(
        "id",
        optionId
      )
      .eq(
        "poll_id",
        pollId
      )
      .maybeSingle();


  if (optionError) {

    console.error(
      "Erreur vérification option :",
      optionError
    );

    throw optionError;
  }


  if (!option) {

    throw new Error(
      "Cette option n'existe pas pour ce sondage."
    );

  }


  /* =======================================================
     4. EXISTING VOTE
  ======================================================= */

  const existingVote =
    await getUserVote(
      pollId
    );


  if (existingVote) {

    throw new Error(
      "Tu as déjà voté pour ce sondage."
    );

  }


  /* =======================================================
     5. INSERT VOTE
  ======================================================= */

  const {
    data,
    error
  } =
    await supabase
      .from(
        "poll_votes"
      )
      .insert({

        poll_id:
          pollId,

        option_id:
          optionId,

        user_id:
          user.id

      })
      .select(`
        id,
        poll_id,
        option_id,
        user_id,
        created_at
      `)
      .single();


  if (error) {

    console.error(
      "Erreur pendant le vote :",
      error
    );


    if (
      error.code ===
      "23505"
    ) {

      throw new Error(
        "Tu as déjà voté pour ce sondage."
      );

    }


    throw error;
  }


  return data as PollVote;
}


/* =========================================================
   GET POLL RESULTS
========================================================= */

export async function getPollResults(
  pollId: string
): Promise<PollResults> {

  const [
    options,
    results
  ] =
    await Promise.all([

      getPollOptions(
        pollId
      ),

      getPollVoteResults(
        pollId
      )

    ]);


  return attachResults(
    options,
    results
  );
}


/* =========================================================
   CREATE POLL SUGGESTION
========================================================= */

export async function createPollSuggestion(
  payload: {
    category: string;
    question: string;
    description?: string;
  }
): Promise<PollSuggestion> {

  const user =
    await getCurrentPollUser();


  if (!user) {

    throw new Error(
      "Tu dois être connecté à ton compte POUP pour proposer une idée."
    );

  }


  const category =
    payload.category.trim();

  const question =
    payload.question.trim();

  const description =
    payload.description?.trim()
    ??
    "";


  if (!category) {

    throw new Error(
      "La catégorie est obligatoire."
    );

  }


  if (!question) {

    throw new Error(
      "La question est obligatoire."
    );

  }


  const {
    data,
    error
  } =
    await supabase
      .from(
        "poll_suggestions"
      )
      .insert({

        category,

        question,

        description,

        user_id:
          user.id,

        status:
          "pending"

      })
      .select(`
        id,
        category,
        question,
        description,
        user_id,
        status,
        created_at,
        updated_at
      `)
      .single();


  if (error) {

    console.error(
      "Erreur création suggestion :",
      error
    );

    throw error;
  }


  return data as PollSuggestion;
}


/* =========================================================
   GET USER SUGGESTIONS
========================================================= */

export async function getMyPollSuggestions():
  Promise<PollSuggestion[]> {

  const user =
    await getCurrentPollUser();


  if (!user) {
    return [];
  }


  const {
    data,
    error
  } =
    await supabase
      .from(
        "poll_suggestions"
      )
      .select(`
        id,
        category,
        question,
        description,
        user_id,
        status,
        created_at,
        updated_at
      `)
      .eq(
        "user_id",
        user.id
      )
      .order(
        "created_at",
        {
          ascending:
            false
        }
      );


  if (error) {

    console.error(
      "Erreur récupération suggestions :",
      error
    );

    throw error;
  }


  return (
    data
    ??
    []
  ) as PollSuggestion[];
}


/* =========================================================
   GET ELIGIBLE GAMES
========================================================= */

export async function getPollEligibleGames():
  Promise<PollGame[]> {

  const {
    data,
    error
  } =
    await supabase
      .from(
        "games"
      )
      .select(`
        id,
        twitch_game_id,
        twitch_name,
        box_art_url,
        description,
        rating,
        poll_enabled
      `)
      .eq(
        "poll_enabled",
        true
      )
      .order(
        "twitch_name",
        {
          ascending:
            true
        }
      );


  if (error) {

    console.error(
      "Erreur récupération jeux éligibles :",
      error
    );

    throw error;
  }


  return (
    data
    ??
    []
  ) as PollGame[];
}