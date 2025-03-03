import { Img } from '~/apiService/instance';
import TrailerVideo from '~/layout/component/TralierVideo';

import styles from './Infor.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faPlay, faRemove } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '~/context';

import { addFavouriteMovie, deleteFavouriteMovie, getFavoritesMovies } from '~/apiService/user';
import SimilarMovie from '../SimilarMovie';
import { getMulti } from '~/apiService/genres';
import { Link, useNavigate,useParams } from 'react-router-dom';

const cs = classNames.bind(styles);

function InforDetail({ width, movieDetail }) {
    // const { id } = useParams();
    const { showToastMessage } = useContext(AuthContext);
    const [genres, setGenres] = useState([]);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));
    const id = JSON.parse(localStorage.getItem('id'));
    const [userFavoriteMovies, setUserFavoriteMovies] = useState([]);

    const getUserFavoritesMovies = async () => {
        if (user) {
            try {
                const result = await getFavoritesMovies(id,user);
                if (result.code === 1000) {
                    setUserFavoriteMovies(result.results);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        getUserFavoritesMovies();
    }, []);

    const handleAddFavoriteMovie = async () => {
        let res;
        if (user) {

            const data = {
                movieId: movieDetail.id,
                userId: id
              };
              
            if(userFavoriteMovies.includes(movieDetail.id)){
                 res = await deleteFavouriteMovie(data,user);
            }else{
                res = await addFavouriteMovie(id,movieDetail.id,user);
            }

            

            console.log(movieDetail.id+id+" ---kaka")

            if (res.code===1000) {

                getUserFavoritesMovies();
            } else {
                console.log(res);
            }
        } else {
            showToastMessage('info', 'Hãy đăng nhập để thực hiện hành động này');
        }
    };

    useEffect(() => {
        const getGenres = async () => {
            // try {
            //     const dataGenres = await getMulti(movieDetail.slug);
            //     setGenres(dataGenres.data);
            // } catch (error) {
            //     console.log(error);
            // }
            setGenres(movieDetail.genres)
        };
        getGenres();
    }, []);
    return (
        <div>
            <div className={cs('contain')}>
                <img
                    src={'http://localhost:8080/images/'+(movieDetail.poster_path || movieDetail.backdrop_path)}
                    className={cs('poster')}
                    alt=""
                />
                <div className={cs('content')}>
                    <h2 className={cs('title')}>{movieDetail.name} </h2>
                    <div className={cs('genres')}>
                        {genres.map((genre, index) => (
                            <Link key={index} to={`/genres/${genre.name}/${genre.id}`}>
                                <span className={cs('genres-item')}>{genre.name}</span>
                            </Link>
                        ))}
                    </div>

                    <div className={cs('Infor')}>
                        <div className={width < 740 ? cs('wrapWatchFav') : 'btnOnly'}>
                            {console.log("Check favorite  list "+userFavoriteMovies)}
                            {userFavoriteMovies.includes(movieDetail.id) ? (
                                <button
                                    className={cs('btnFavorite')}
                                    onClick={handleAddFavoriteMovie}
                                    style={{
                                        border: '2px solid var(--primary)',
                                        color: 'var(--primary)',
                                        fontSize: '1.4rem',
                                        backgroundColor: 'white',
                                    }}
                                >
                                    <FontAwesomeIcon
                                        className={cs('icon')}
                                        icon={faRemove}
                                        style={{
                                            marginRight: '10px',
                                            marginBottom: '-1px',
                                            fontSize: '1.6rem',
                                        }}
                                    />
                                    Bỏ yêu thích
                                </button>
                            ) : (
                                <button className={cs('btnFavorite')} onClick={handleAddFavoriteMovie}>
                                    <FontAwesomeIcon className={cs('icon')} icon={faHeart} />
                                    Thêm yêu thích
                                </button>
                            )}

                            {width < 740 && (
                                <button
                                    className={cs('playBtn')}
                                    onClick={() =>
                                        navigate(`/${movieDetail.category}/${movieDetail.id}/watch/${movieDetail.slug}`)
                                    }
                                >
                                    <FontAwesomeIcon className={cs('icon')} icon={faPlay} />
                                    Xem Ngay
                                </button>
                            )}
                        </div>

                        <h2 className={cs('titleInfor')}>Thông tin</h2>
                        <span>{`Ngày Phát Hành : ${movieDetail.releaseDate}`}</span>
                        <span>{`Điểm Đánh Giá IMDb : ${movieDetail.ibmPoints}`}</span>
                        <span>{`Quốc Gia Sản Xuất : ${movieDetail.country || 'United States of America'}`}</span>
                    </div>
                </div>
            </div>
            <div className={cs('summary')}>
                <h4 className={cs('titleOverview')}>Tóm tắt</h4>
                <p className={cs('overview')}>{movieDetail.overview}</p>
            </div>
            <div className={cs('Trailer')}>
                <h4 className={cs('titleOverview')}>Trailer</h4>
                <TrailerVideo movieDetail={movieDetail} />
            </div>
            <div className={cs('Similar')}>
                <h4 className={cs('titleOverview')}>Đề xuất</h4>
                <SimilarMovie category={movieDetail.category} slug={movieDetail.slug} />
            </div>
        </div>
    );
}

export default InforDetail;
