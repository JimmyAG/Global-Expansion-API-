export abstract class MatchesServiceAbstract {
  abstract rebuildProjectMatches(
    projectId: string,
  ): Promise<{ message: string }>;

  abstract refreshMatches(): Promise<{ message: string }>;
}
