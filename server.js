const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer  = require('multer')
const upload = multer();

const app = express(); // tworzymy nową aplikację expressową i przypisujemy ją do stałej app

app.use(express.static(path.join(__dirname, '/public')));

app.use(express.urlencoded({ extended: false })); // middleware do poprawnej obsługi formularza z metody post; extended: false, ponieważ nie mamy zagnieżdżonych danych

app.engine('hbs', hbs()); // informujemy Express, że pliki o rozszerzeniu .hbs powinny być renderowane przez silnik hbs (czyli zaimportowany Handlebars)
app.set('view engine', 'hbs'); // ten fragment mówi, że w aplikacji używamy widoków właśnie o tym rozszerzeniu (przy kompilacji, będziemy mogli wskazywać tylko jego nazwę, a Express sam domyśli się, że ma szukać pliku z odpowiednią końcówką)
// domyślnie Handlebars szuka templete'ów w katalogu views

app.post('/contact/send-message', upload.single('file'), (req, res) => { // post - do przesyłania większych obiektów; res.json to odpowiednik res.send, tylko zwraca dane w formacie JSON, zamiast tekstu
  const { author, sender, title, message } = req.body; // body - atrybut obiektu zapytania zawierający dane wysyłane wraz z żądaniem (dostępne w obiekcie request)
  const fileName = req.file.originalname;

  if(author && sender && title && message && fileName) {
    res.render('contact', { isSent: true, fileName });
  }
  else {
    res.render('contact', { isError: true });
  }
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { layout: false,  name: req.params.name }); // render przed zwróceniem odpowiedzi przepuszcza plik przez zdefiniowany przez nas silnik (w app.set)
}); // pierwszy argument ustala nazwę widoku, który chcemy wykorzystać, a drugi przekazuje obiekt z wartościami dla placeholderów

app.use((req, res) => {
  res.status(404).send('404 not found...');
})

app.listen(8000, () => { // na jakim porcie chcemy utworzyć serwer HTTP
  console.log('Server is running on port: 8000'); // funkcja callback nie jest wymagana
});



// app.get('/', (req, res) => { // dodajemy endpoint: app to odnośnik do serwera, .get ustala metodę, którą chcemy obsługiwać
//   res.sendFile(path.join(__dirname, '/views/index.html')); // pierwszy parametr to link, o którym mowa; drugi to callback uruchamiany, kiedy serwer wykryje, że użytkownik  wchodzi na stronę
// });

// req zawiera informacje o użytkowniku, który łączy się z serwerem (jego przeglądarka, IP itp.) oraz o samym zapytaniu.
// Ma więc np. dostęp do danych wysyłanych wraz z zapytaniem (o ile użytkownik takie wysyłał).

// res zawiera za to wiele przydatnych metod do komunikacji zwrotnej. Możemy wysłać np. komunikat tekstowy (metoda send),
// kod HTML (również send), dane w formacie JSON (metoda json) czy... nawet cały plik (metoda sendFile)! Istnieją tutaj również np. metody do zwracania kodów statusu.

// path.join stara się odpowiednio "skleić" ścieżkę bazową ze ścieżką docelową
// stała __dirname zwraca adres aktualnej ścieżki (znajdź plik index.html w folderze views, przy czym zacznij szukać w katalogu, w którym odpalono skrypt)

// gdy next znajdzie endpoint, obiekt res otrzymuje dostęp do metody show i może ją wykorzytać zamiast sendFile

// middleware wpisany po endpointach wyłapuje wszystkie wadliwe linki (mimo że nie ma podanej ścieżki) - jeśli wpiszemy link, który ma pasujący endpoint, to końcowy middleware nawet się nie uruchomi
// wbudowana funkcja status zwraca kod odpowiedzi