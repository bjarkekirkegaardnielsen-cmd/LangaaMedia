LANGÅ MEDIA MED DECAP CMS

Denne version er bygget, så du kan redigere indhold via /admin/ i browseren.

VIGTIGT
Decap CMS skal gemme ændringer et sted. Derfor skal hjemmesiden ligge i et GitHub-repository,
som Netlify deployer fra. Netlify Git Gateway er deprecated for nye opsætninger, så denne
version bruger Decaps GitHub-backend.

DET ENESTE DER MANGLER I FILERNE
Når du har oprettet dit GitHub-repository, skal linjen i admin/config.yml:
repo: SKIFT-MIG/LANGAA-MEDIA
ændres til dit GitHub-brugernavn og repository-navn, fx:
repo: bjarke/langaa-media

Derefter forbinder du repository'et med Netlify og sætter GitHub OAuth op til Decap CMS.
Når det er gjort, går du fremover til:
https://ditdomæne.dk/admin/

Her kan du rette:
- Forside
- Om mig
- Journalistik
- Presse & kommunikation
- Langåen
- Foredrag
- Kontaktoplysninger

Din nye Om mig-tekst med navnet Bjarke er allerede lagt ind.

Bemærk:
Selve hjemmesiden kan fortsat hostes på Netlifys gratis niveau, afhængigt af Netlifys
aktuelle planvilkår og dit forbrug.
