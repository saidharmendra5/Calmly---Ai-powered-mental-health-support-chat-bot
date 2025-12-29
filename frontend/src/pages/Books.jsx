import { Book, ExternalLink, Heart } from 'lucide-react';
import { bookRecommendations } from '../data/mockData';
import { useState } from 'react';

const BookCard = ({ book }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all hover:transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10">
      <div className="relative h-64 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
            } transition-colors`}
          />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-xs font-semibold">
            {book.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-gray-400 text-sm mb-3">by {book.author}</p>
        <p className="text-gray-300 mb-4 line-clamp-3">{book.description}</p>
        <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2 group">
          <Book className="w-5 h-5" />
          <span>Learn More</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const Books = () => {
  const categories = [...new Set(bookRecommendations.map(book => book.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBooks = selectedCategory === 'All'
    ? bookRecommendations
    : bookRecommendations.filter(book => book.category === selectedCategory);

  return (
    <div className="h-full bg-gray-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Book Recommendations</h1>
          <p className="text-gray-400 text-lg">
            Discover books that can guide you on your mental health journey. These carefully selected
            titles offer insights, strategies, and support for emotional wellbeing.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Books
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl border border-white/10">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Need a Personalized Recommendation?</h3>
              <p className="text-gray-300 mb-4">
                Our AI can suggest books based on your specific needs and current emotional state.
                Start a chat to get personalized recommendations.
              </p>
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all">
                Ask for Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
