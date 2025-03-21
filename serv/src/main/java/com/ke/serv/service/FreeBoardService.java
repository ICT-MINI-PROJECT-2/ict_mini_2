package com.ke.serv.service;

import com.ke.serv.entity.FreeBoardEntity;
import com.ke.serv.repository.FreeBoardRepository;
import com.ke.serv.vo.PagingVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FreeBoardService {
    private final FreeBoardRepository repository;
    public int totalRecord(PagingVO pVO) {
        if (pVO.getSearchWord() == null || pVO.getSearchWord().isEmpty()){
            return repository.countIdByCategory("free");
        } else {
            return repository.countIdByCategoryAndTitleContaining("free", pVO.getSearchWord());
        }
    }

    public List<FreeBoardEntity> noticeSelect() {
        return repository.noticeSelect();
    }

    public List<FreeBoardEntity> freePageSelect(PagingVO pVO) {
        if (pVO.getSearchWord() == null || pVO.getSearchWord().isEmpty()) {
            return repository.findAllByCategoryOrderByIdDesc(
                    "free",
                    PageRequest.of(pVO.getNowPage() - 1, pVO.getOnePageRecord())
            );
        } else {
            return repository.findAllByCategoryAndTitleContainingOrderByIdDesc(
                    "free",
                    pVO.getSearchWord(),
                    PageRequest.of(pVO.getNowPage() - 1, pVO.getOnePageRecord())
            );
        }
    }

    public FreeBoardEntity boardInsert(FreeBoardEntity entity) {
        return repository.save(entity);
    }

    public FreeBoardEntity boardSelect(int id) {
        return repository.findById(id);
    }

    public void boardDelete(int id) {
        repository.deleteById(id);
    }

    public int countBoardSelect(int id) {
        return repository.countById(id);
    }
}
