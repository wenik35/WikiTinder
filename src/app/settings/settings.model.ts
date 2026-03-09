export class SettingsModel {
    public showName: boolean = true;
    public showDescription: boolean = true;
    public onlyLivingPeople: boolean = false;
    public onlyWithImages: boolean = true;
    public onlyWithPreferredLanguage: boolean = true;
    public languagePreferences: string[] = ['en', 'de', 'fr', 'es'];
}