package com.examportal.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.examportal.dao.StudentQueryDao;
import com.examportal.dto.StudentQueryDTO;
import com.examportal.dto.StudentQueryResponseDTO;
import com.examportal.entities.StudentQuery;
import com.examportal.exceptions.ResourceNotFoundException;

@Service
@Transactional
public class StudentQueryServiceImpl implements StudentQueryService {

    @Autowired
    private StudentQueryDao studentQueryDao;
    
    @Autowired
    private ModelMapper mapper;

    @Override
    public StudentQueryResponseDTO submitQuery(String username, StudentQueryDTO queryDTO) {
        StudentQuery studentQuery = new StudentQuery(username, queryDTO.getTitle(), queryDTO.getQuery());
        StudentQuery savedQuery = studentQueryDao.save(studentQuery);
        return mapper.map(savedQuery, StudentQueryResponseDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentQueryResponseDTO> getQueriesByUser(String username) {
        return studentQueryDao.findByUsername(username).stream()
            .map(query -> mapper.map(query, StudentQueryResponseDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentQueryResponseDTO> getAllQueries() {
        return studentQueryDao.findAll().stream()
            .map(query -> mapper.map(query, StudentQueryResponseDTO.class))
            .collect(Collectors.toList());
    }

    @Override
    public void deleteQuery(Long queryId) {
        if (!studentQueryDao.existsById(queryId)) {
            throw new ResourceNotFoundException("Query not found with id: " + queryId);
        }
        studentQueryDao.deleteById(queryId);
    }
}
