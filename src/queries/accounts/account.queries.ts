export const accountsQueries = {
  get_new_users_24h_limit_to: (limit: number) => `
    SELECT TOP  (${limit}) name, created, reputation_ui
    FROM Accounts
    WHERE created >= DATEADD(hour, -24, GETDATE())
    ORDER BY created DESC;
  `,
  get_new_users_past_month_with_low_votes: `
      SELECT
        a.name AS username,
        COUNT(DISTINCT c.id) AS total_comments,
        COUNT(v.id) AS total_votes
      FROM
        Accounts a
      JOIN
        Comments c ON c.author = a.name
      LEFT JOIN
        Votes v ON v.author = c.author AND v.permlink = c.permlink
      WHERE
        a.created >= DATEADD(day, -30, GETDATE())
      GROUP BY
        a.name
      HAVING
        COUNT(DISTINCT c.id) >= 1 AND COUNT(v.id) < 5
      ORDER BY
        total_votes ASC;
    `,
  getOneMonthNewUsersLowVotes: `
        SELECT
            a.name AS username,
            COUNT(DISTINCT c.id) AS total_comments,
            COUNT(v.id) AS total_votes
        FROM
            Accounts a
        JOIN
            Comments c ON c.author = a.name
        LEFT JOIN
            Votes v ON v.author = c.author AND v.permlink = c.permlink
        WHERE
            a.created >= DATEADD(day, -30, GETDATE())
        GROUP BY
            a.name
        HAVING
            COUNT(DISTINCT c.id) >= 1 AND COUNT(v.id) < 5
        ORDER BY
            total_votes ASC;
    `,
  getNewAccountsLast24h_limitTo: (limit: number) => `
    SELECT TOP (${limit}) name, created
    FROM Accounts
    WHERE created >= DATEADD(day, -1, GETDATE())
    ORDER BY created DESC;
  `,
  get_new_30_days_min_1_post_avg_low_votes: `
    SELECT
      a.name,
      a.created AS account_created, 
      MIN(c.created) AS first_post_date,
      a.reputation_ui,
      COUNT(c.id) AS total_posts,
      AVG(c.net_votes) AS avg_votes
    FROM
      Accounts a
    JOIN
      Comments c ON a.name = c.author
    WHERE
      a.created >= DATEADD(day, -30, GETDATE())
      AND c.parent_author = ''
    GROUP BY
      a.name,
      a.created,
      a.reputation_ui
    HAVING
      COUNT(c.id) >= 1 AND AVG(c.net_votes) < 5
    ORDER BY
      first_post_date DESC;
  `,
  get_new_30_days_min_1_post_avg_low_votes_limit_to: (limit: number) => `
    SELECT TOP ${limit}
      a.name,
      a.created AS account_created, 
      MIN(c.created) AS first_post_date,
      a.reputation_ui,
      COUNT(c.id) AS total_posts,
      AVG(c.net_votes) AS avg_votes
    FROM
      Accounts a
    JOIN
      Comments c ON a.name = c.author
    WHERE
      a.created >= DATEADD(day, -30, GETDATE())
      AND c.parent_author = ''
    GROUP BY
      a.name,
      a.created,
      a.reputation_ui
    HAVING
      COUNT(c.id) >= 1 AND AVG(c.net_votes) < 5
    ORDER BY
      first_post_date DESC;
  `,
};
