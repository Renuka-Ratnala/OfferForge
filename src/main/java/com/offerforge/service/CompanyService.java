package com.offerforge.service;

import com.offerforge.entity.Company;
import com.offerforge.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.offerforge.dto.CompanyRequest;
import com.offerforge.dto.CompanyResponse;
import java.util.List;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public CompanyResponse saveCompany(CompanyRequest request) {

        Company company = new Company();

        company.setCompanyName(request.getCompanyName());
        company.setLocation(request.getLocation());
        company.setWebsite(request.getWebsite());
        company.setIndustry(request.getIndustry());
        company.setDescription(request.getDescription());

        Company savedCompany = companyRepository.save(company);

        return new CompanyResponse(
                savedCompany.getId(),
                savedCompany.getCompanyName(),
                savedCompany.getLocation(),
                savedCompany.getWebsite(),
                savedCompany.getIndustry(),
                savedCompany.getDescription()
        );
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

    public void deleteCompany(Long id) {
        companyRepository.deleteById(id);
    }
    public Company updateCompany(Long id, Company updatedCompany) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        company.setCompanyName(updatedCompany.getCompanyName());
        company.setLocation(updatedCompany.getLocation());
        company.setWebsite(updatedCompany.getWebsite());
        company.setIndustry(updatedCompany.getIndustry());
        company.setDescription(updatedCompany.getDescription());

        return companyRepository.save(company);
    }
}