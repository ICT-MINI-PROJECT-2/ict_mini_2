import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const NoticeEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [contentImageFiles, setContentImageFiles] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (id) {
            fetchEventData();
        }
    }, [id]);

    const fetchEventData = async () => {
        try {
            const response = await axios.get(`http://localhost:9977/board/view/edit/${id}`);
            const eventData = response.data;
            setTitle(eventData.subject || '');
            setContent(eventData.content || '');
        } catch (error) {
            console.error('데이터 불러오기 실패:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        
        formData.append('event_title', title);
        formData.append('event_content', content);
        formData.append('category', 'NOTICE');
        formData.append('user_id', 'admin'); // ⚠️ 실제 사용자 ID로 변경 필요

        if (id) {
            formData.append('event_id', id);
        }

        if (thumbnail) {
            formData.append('mf', thumbnail);
        }
        if (contentImageFiles.length > 0) {
            contentImageFiles.forEach(file => {
                formData.append('files', file);
            });
        }

        // 전송 전 formData 내용 확인
        console.log("전송할 데이터 확인:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            const response = await axios.post('http://localhost:9977/board/eventWriteOk', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            console.log('서버 응답:', response.data);
            navigate('/notice');
        } catch (error) {
            console.error('에러 상세 정보:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert('저장 실패: ' + (error.response?.data || error.message));
        }
    };

    const handleThumbnailChange = (e) => {
        if (e.target.files[0]) {
            setThumbnail(e.target.files[0]);
        }
    };

    const handleImageUpload = (file) => {
        setContentImageFiles(prev => [...prev, file]);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="container mt-5">
            <h2>{id ? '공지사항 수정' : '공지사항 작성'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">제목</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">내용</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={content}
                        onReady={editor => {
                            console.log('Editor is ready to use!', editor);
                        }}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setContent(data);
                        }}
                        onError={(error, { willEditorRestart }) => {
                            console.error('CKEditor 에러:', error);
                            if (willEditorRestart) {
                                console.log('CKEditor will restart');
                            }
                        }}
                        config={{
                            language: 'ko',
                            toolbar: [
                                'heading',
                                '|',
                                'bold',
                                'italic',
                                'link',
                                'bulletedList',
                                'numberedList',
                                '|',
                                'uploadImage',
                                'blockQuote',
                                'undo',
                                'redo'
                            ],
                            simpleUpload: {
                                uploadUrl: 'http://localhost:9977/upload',
                                withCredentials: true,
                                headers: {
                                    'X-CSRF-TOKEN': 'CSRF-Token',
                                    Authorization: 'Bearer <JSON Web Token>'
                                }
                            }
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">썸네일</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleThumbnailChange}
                        ref={fileInputRef}
                    />
                </div>

                <div className="mb-3">
                    <button type="submit" className="btn btn-primary">
                        {id ? '수정하기' : '등록하기'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => navigate('/notice')}
                    >
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoticeEdit; 