# Test scenariji aplikacije Flight AI Recommender

## 1. Registracija korisnika

**Opis:** Provera da li novi korisnik može uspešno da kreira nalog.

**Koraci testiranja:**

1. Otvoriti stranicu za registraciju.
2. Uneti ime, prezime, email i lozinku.
3. Kliknuti na dugme za registraciju.

**Očekivani rezultat:**  
Sistem kreira novog korisnika i prikazuje poruku o uspešnoj registraciji.

**Dobijeni rezultat:**  
Korisnik je uspešno registrovan.

**Status:** Uspešno.

---

## 2. Registracija sa postojećim email-om

**Opis:** Provera da li sistem sprečava registraciju korisnika sa email adresom koja već postoji.

**Koraci testiranja:**

1. Otvoriti stranicu za registraciju.
2. Uneti email adresu koja već postoji u bazi.
3. Kliknuti na dugme za registraciju.

**Očekivani rezultat:**  
Sistem prikazuje grešku da korisnik sa tom email adresom već postoji.

**Dobijeni rezultat:**  
Sistem ne dozvoljava dupliranje email adrese.

**Status:** Uspešno.

---

## 3. Prijava korisnika

**Opis:** Provera prijave korisnika sa ispravnim podacima.

**Koraci testiranja:**

1. Otvoriti stranicu za prijavu.
2. Uneti postojeći email i lozinku.
3. Kliknuti na dugme za prijavu.

**Očekivani rezultat:**  
Sistem prijavljuje korisnika i čuva JWT token.

**Dobijeni rezultat:**  
Korisnik je uspešno prijavljen i može da pristupi zaštićenim stranicama.

**Status:** Uspešno.

---

## 4. Prijava sa pogrešnom lozinkom

**Opis:** Provera ponašanja sistema kada korisnik unese pogrešnu lozinku.

**Koraci testiranja:**

1. Otvoriti stranicu za prijavu.
2. Uneti postojeći email i pogrešnu lozinku.
3. Kliknuti na dugme za prijavu.

**Očekivani rezultat:**  
Sistem prikazuje poruku o neispravnim podacima.

**Dobijeni rezultat:**  
Korisnik ne može da se prijavi sa pogrešnom lozinkom.

**Status:** Uspešno.

---

## 5. Pristup zaštićenoj korisničkoj strani

**Opis:** Provera da neprijavljen korisnik ne može da pristupi korisničkim stranicama.

**Koraci testiranja:**

1. Odjaviti se iz aplikacije.
2. Pokušati direktno otvoriti stranicu `/my-bookings`.
3. Posmatrati ponašanje aplikacije.

**Očekivani rezultat:**  
Sistem preusmerava korisnika na stranicu za prijavu.

**Dobijeni rezultat:**  
Neprijavljen korisnik ne može da pristupi zaštićenoj strani.

**Status:** Uspešno.

---

## 6. Pretraga letova

**Opis:** Provera pretrage letova po polaznom aerodromu, dolaznom aerodromu i datumu.

**Koraci testiranja:**

1. Otvoriti stranicu za pretragu letova.
2. Izabrati polazni aerodrom BEG.
3. Izabrati dolazni aerodrom.
4. Izabrati datum za koji postoji termin leta.
5. Kliknuti na dugme za pretragu.

**Očekivani rezultat:**  
Sistem prikazuje dostupne termine letova.

**Dobijeni rezultat:**  
Prikazani su letovi koji odgovaraju unetim kriterijumima.

**Status:** Uspešno.

---

## 7. Rezervacija leta

**Opis:** Provera kreiranja rezervacije za prijavljenog korisnika.

**Koraci testiranja:**

1. Prijaviti se kao korisnik.
2. Otvoriti stranicu za pretragu letova.
3. Pronaći dostupan let.
4. Izabrati broj putnika.
5. Kliknuti na dugme za rezervaciju.

**Očekivani rezultat:**  
Sistem kreira rezervaciju sa statusom PENDING i smanjuje broj dostupnih mesta.

**Dobijeni rezultat:**  
Rezervacija je uspešno kreirana i prikazuje se u delu „Moje rezervacije”.

**Status:** Uspešno.

---

## 8. Simulirana potvrda plaćanja

**Opis:** Provera promene statusa rezervacije iz PENDING u CONFIRMED.

**Koraci testiranja:**

1. Otvoriti stranicu „Moje rezervacije”.
2. Pronaći rezervaciju sa statusom PENDING.
3. Kliknuti na dugme „Potvrdi plaćanje”.
4. Potvrditi akciju.

**Očekivani rezultat:**  
Status rezervacije se menja iz PENDING u CONFIRMED.

**Dobijeni rezultat:**  
Plaćanje je uspešno simulirano i status rezervacije je promenjen.

**Status:** Uspešno.

---

## 9. Otkazivanje rezervacije

**Opis:** Provera otkazivanja aktivne rezervacije.

**Koraci testiranja:**

1. Otvoriti stranicu „Moje rezervacije”.
2. Pronaći rezervaciju sa statusom PENDING ili CONFIRMED.
3. Kliknuti na dugme „Otkaži rezervaciju”.
4. Potvrditi akciju.

**Očekivani rezultat:**  
Status rezervacije se menja u CANCELLED i broj dostupnih mesta se povećava.

**Dobijeni rezultat:**  
Rezervacija je uspešno otkazana.

**Status:** Uspešno.

---

## 10. AI preporuka destinacija

**Opis:** Provera generisanja preporuka destinacija na osnovu korisničkih odgovora.

**Koraci testiranja:**

1. Prijaviti se kao korisnik.
2. Otvoriti stranicu „AI preporuke”.
3. Odgovoriti na pitanja o tipu putovanja, budžetu, klimi i aktivnostima.
4. Kliknuti na dugme za generisanje preporuka.

**Očekivani rezultat:**  
Sistem prikazuje tri preporučene destinacije sa procentom poklapanja i razlogom preporuke.

**Dobijeni rezultat:**  
AI modul prikazuje preporučene destinacije.

**Status:** Uspešno.

---

## 11. Povezivanje AI preporuke sa pretragom letova

**Opis:** Provera da korisnik iz AI preporuke može direktno da otvori pretragu letova.

**Koraci testiranja:**

1. Generisati AI preporuke.
2. Kod preporučene destinacije kliknuti na dugme „Prikaži letove”.
3. Posmatrati da li se otvara stranica za pretragu letova.

**Očekivani rezultat:**  
Sistem otvara stranicu za pretragu letova sa popunjenom preporučenom destinacijom.

**Dobijeni rezultat:**  
Korisnik može direktno iz AI preporuke da pređe na dostupne letove.

**Status:** Uspešno.

---

## 12. Pregled istorije AI preporuka

**Opis:** Provera prikaza ranije generisanih AI preporuka.

**Koraci testiranja:**

1. Prijaviti se kao korisnik.
2. Otvoriti stranicu „Moje AI preporuke”.
3. Pregledati ranije generisane preporuke.

**Očekivani rezultat:**  
Sistem prikazuje prethodne AI sesije i preporučene destinacije.

**Dobijeni rezultat:**  
Istorija preporuka je uspešno prikazana.

**Status:** Uspešno.

---

## 13. Pristup admin panelu

**Opis:** Provera da samo administrator može pristupiti admin panelu.

**Koraci testiranja:**

1. Prijaviti se kao običan korisnik.
2. Pokušati otvoriti `/admin`.
3. Zatim se prijaviti kao administrator.
4. Ponovo otvoriti `/admin`.

**Očekivani rezultat:**  
Običan korisnik nema pristup admin panelu, dok administrator ima pristup.

**Dobijeni rezultat:**  
Admin panel je dostupan samo korisniku sa ulogom ADMIN.

**Status:** Uspešno.

---

## 14. Upravljanje aerodromima

**Opis:** Provera administratorskog CRUD-a za aerodrome.

**Koraci testiranja:**

1. Prijaviti se kao administrator.
2. Otvoriti admin stranicu za aerodrome.
3. Dodati novi aerodrom.
4. Izmeniti podatke aerodroma.
5. Obrisati aerodrom koji nije povezan sa letovima.

**Očekivani rezultat:**  
Administrator može da doda, izmeni i obriše aerodrom.

**Dobijeni rezultat:**  
CRUD operacije nad aerodromima rade uspešno.

**Status:** Uspešno.

---

## 15. Upravljanje destinacijama

**Opis:** Provera administratorskog CRUD-a za destinacije.

**Koraci testiranja:**

1. Prijaviti se kao administrator.
2. Otvoriti admin stranicu za destinacije.
3. Dodati novu destinaciju.
4. Izmeniti destinaciju.
5. Obrisati destinaciju koja nije povezana sa preporukama.

**Očekivani rezultat:**  
Administrator može da upravlja destinacijama koje se koriste za AI preporuke.

**Dobijeni rezultat:**  
CRUD operacije nad destinacijama rade uspešno.

**Status:** Uspešno.

---

## 16. Upravljanje letovima

**Opis:** Provera administratorskog CRUD-a za avio-linije.

**Koraci testiranja:**

1. Prijaviti se kao administrator.
2. Otvoriti admin stranicu za letove.
3. Dodati novi let između dva aerodroma.
4. Izmeniti let.
5. Obrisati let koji nije povezan sa terminima.

**Očekivani rezultat:**  
Administrator može da upravlja avio-linijama.

**Dobijeni rezultat:**  
CRUD operacije nad letovima rade uspešno.

**Status:** Uspešno.

---

## 17. Upravljanje terminima letova

**Opis:** Provera administratorskog CRUD-a za termine letova.

**Koraci testiranja:**

1. Prijaviti se kao administrator.
2. Otvoriti admin stranicu za termine letova.
3. Dodati novi termin leta.
4. Izmeniti cenu, vreme ili broj mesta.
5. Obrisati termin koji nije povezan sa rezervacijama.

**Očekivani rezultat:**  
Administrator može da upravlja konkretnim terminima letova.

**Dobijeni rezultat:**  
CRUD operacije nad terminima letova rade uspešno.

**Status:** Uspešno.

---

## 18. Admin pregled svih rezervacija

**Opis:** Provera da administrator može da vidi sve korisničke rezervacije.

**Koraci testiranja:**

1. Prijaviti se kao administrator.
2. Otvoriti admin stranicu „Rezervacije”.
3. Pregledati listu rezervacija.

**Očekivani rezultat:**  
Administrator vidi rezervacije svih korisnika, njihove statuse, letove, putnike i ukupne cene.

**Dobijeni rezultat:**  
Pregled svih rezervacija radi uspešno.

**Status:** Uspešno.

---

# Zaključak testiranja

Na osnovu sprovedenih test scenarija može se zaključiti da aplikacija uspešno podržava osnovne funkcionalnosti sistema: registraciju i prijavu korisnika, pretragu i rezervaciju letova, simulaciju plaćanja, otkazivanje rezervacije, AI preporuke destinacija i administratorsko upravljanje podacima.

Posebno je potvrđeno da su zaštićene rute dostupne samo prijavljenim korisnicima, dok je administratorski deo dostupan samo korisnicima sa ulogom ADMIN.
