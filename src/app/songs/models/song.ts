export interface Song {
  id: string;
  comment: string;
  final: boolean;
  key: string;
  number: number;
  tempo: number;
  text: string;
  title: string;
  type: string;

  legalType: string;
  legalLink: string;
  legalOwner: string;
  legalOwnerId: string;
  legalLicenseId: string;

  artist: string;
  label: string;
  termsOfUse: string;
  origin: string;
}
